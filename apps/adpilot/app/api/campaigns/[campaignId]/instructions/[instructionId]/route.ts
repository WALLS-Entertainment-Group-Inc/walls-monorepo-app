import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import {
  deleteEntityAgentInstruction,
  updateEntityAgentInstruction,
} from "@/lib/agent-instructions-server";

type RouteContext = {
  params: Promise<{ campaignId: string; instructionId: string }>;
};

type UpdateInstructionBody = {
  instructions?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
};

export async function PATCH(request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { instructionId } = await context.params;

  let body: UpdateInstructionBody;
  try {
    body = (await request.json()) as UpdateInstructionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const instruction = await updateEntityAgentInstruction({
      scope,
      instructionId,
      patch: body,
    });
    return NextResponse.json({ instruction });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update instruction";
    const status = message === "Instruction not found" ? 404 : 400;
    console.error("[adpilot] update agent instruction:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { instructionId } = await context.params;

  try {
    await deleteEntityAgentInstruction({ scope, instructionId });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete instruction";
    console.error("[adpilot] delete agent instruction:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
