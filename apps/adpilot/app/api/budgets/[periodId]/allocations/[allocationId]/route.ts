import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import {
  deleteBudgetAllocation,
  updateBudgetAllocation,
} from "@/lib/budgets-server";
import {
  BUDGET_ALLOCATION_CATEGORIES,
  BUDGET_CHANNELS,
  dollarsToMicros,
  type BudgetAllocationCategory,
  type BudgetChannel,
} from "@/lib/budgets-shared";

type RouteContext = {
  params: Promise<{ periodId: string; allocationId: string }>;
};

type PatchBody = {
  name?: string;
  category?: string;
  channel?: string | null;
  amountDollars?: number;
  amountMicros?: number;
  currency?: string;
  notes?: string | null;
  sortOrder?: number;
};

export async function PATCH(request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allocationId } = await context.params;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.name !== undefined && !body.name.trim()) {
    return NextResponse.json(
      { error: "Allocation name cannot be empty" },
      { status: 400 },
    );
  }

  const category =
    body.category === undefined
      ? undefined
      : BUDGET_ALLOCATION_CATEGORIES.includes(
            body.category as BudgetAllocationCategory,
          )
        ? (body.category as BudgetAllocationCategory)
        : null;
  if (category === null) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  let channel: BudgetChannel | null | undefined = undefined;
  if (body.channel !== undefined) {
    if (body.channel == null || body.channel === "") {
      channel = null;
    } else if (BUDGET_CHANNELS.includes(body.channel as BudgetChannel)) {
      channel = body.channel as BudgetChannel;
    } else {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }
  }

  const amountMicros =
    body.amountMicros != null
      ? Number(body.amountMicros)
      : body.amountDollars != null
        ? dollarsToMicros(Number(body.amountDollars))
        : undefined;

  if (
    amountMicros !== undefined &&
    (!Number.isFinite(amountMicros) || amountMicros < 0)
  ) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const allocation = await updateBudgetAllocation({
      scope,
      allocationId,
      patch: {
        name: body.name,
        category,
        channel,
        amountMicros,
        currency: body.currency,
        notes: body.notes,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ allocation });
  } catch (error) {
    console.error("[adpilot] update budget allocation:", error);
    return NextResponse.json(
      { error: "Failed to update allocation" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allocationId } = await context.params;

  try {
    await deleteBudgetAllocation({ scope, allocationId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[adpilot] delete budget allocation:", error);
    return NextResponse.json(
      { error: "Failed to delete allocation" },
      { status: 500 },
    );
  }
}
