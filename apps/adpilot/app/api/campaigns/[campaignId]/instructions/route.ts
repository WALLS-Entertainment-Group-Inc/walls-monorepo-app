import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import {
  createEntityAgentInstruction,
  listEntityAgentInstructions,
} from "@/lib/agent-instructions-server";

type RouteContext = {
  params: Promise<{ campaignId: string }>;
};

type CreateInstructionBody = {
  instructions?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
};

export async function GET(_request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { campaignId: entityId } = await context.params;

  try {
    const instructions = await listEntityAgentInstructions({ scope, entityId });
    return NextResponse.json({ instructions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load instructions";
    console.error("[adpilot] list agent instructions:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { campaignId: entityId } = await context.params;

  let body: CreateInstructionBody;
  try {
    body = (await request.json()) as CreateInstructionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.instructions || !body.instructions.trim()) {
    return NextResponse.json(
      { error: "Instructions cannot be empty." },
      { status: 400 },
    );
  }

  try {
    const instruction = await createEntityAgentInstruction({
      scope,
      entityId,
      instructions: body.instructions,
      startsAt: body.startsAt ?? null,
      endsAt: body.endsAt ?? null,
      isActive: body.isActive,
    });
    return NextResponse.json({ instruction }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create instruction";
    const status = message === "Entity not found" ? 404 : 400;
    console.error("[adpilot] create agent instruction:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
