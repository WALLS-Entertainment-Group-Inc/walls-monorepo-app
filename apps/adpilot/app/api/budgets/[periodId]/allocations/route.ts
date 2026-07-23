import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import { createBudgetAllocation } from "@/lib/budgets-server";
import {
  BUDGET_ALLOCATION_CATEGORIES,
  BUDGET_CHANNELS,
  dollarsToMicros,
  type BudgetAllocationCategory,
  type BudgetChannel,
} from "@/lib/budgets-shared";

type RouteContext = {
  params: Promise<{ periodId: string }>;
};

type CreateBody = {
  name?: string;
  category?: string;
  channel?: string | null;
  amountDollars?: number;
  amountMicros?: number;
  currency?: string;
  notes?: string | null;
  sortOrder?: number;
};

export async function POST(request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { periodId } = await context.params;

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json(
      { error: "Allocation name is required" },
      { status: 400 },
    );
  }

  const category = BUDGET_ALLOCATION_CATEGORIES.includes(
    body.category as BudgetAllocationCategory,
  )
    ? (body.category as BudgetAllocationCategory)
    : null;
  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  let channel: BudgetChannel | null = null;
  if (body.channel != null && body.channel !== "") {
    if (!BUDGET_CHANNELS.includes(body.channel as BudgetChannel)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }
    channel = body.channel as BudgetChannel;
  }

  const amountMicros =
    body.amountMicros != null
      ? Number(body.amountMicros)
      : dollarsToMicros(Number(body.amountDollars ?? 0));

  if (!Number.isFinite(amountMicros) || amountMicros < 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const allocation = await createBudgetAllocation({
      scope,
      periodId,
      data: {
        name: body.name,
        category,
        channel,
        amountMicros,
        currency: body.currency,
        notes: body.notes,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ allocation }, { status: 201 });
  } catch (error) {
    console.error("[adpilot] create budget allocation:", error);
    return NextResponse.json(
      { error: "Failed to create allocation" },
      { status: 500 },
    );
  }
}
