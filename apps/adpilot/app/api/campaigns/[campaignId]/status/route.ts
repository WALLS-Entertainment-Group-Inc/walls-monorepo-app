import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import {
  updateEntityDeliveryStatus,
  type DeliveryStatus,
} from "@/lib/entity-status-server";

type RouteContext = {
  params: Promise<{ campaignId: string }>;
};

type StatusPatchBody = {
  status?: DeliveryStatus;
};

export async function PATCH(request: Request, context: RouteContext) {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { campaignId: entityId } = await context.params;

  let body: StatusPatchBody;
  try {
    body = (await request.json()) as StatusPatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.status !== "ACTIVE" && body.status !== "PAUSED") {
    return NextResponse.json(
      { error: "status must be ACTIVE or PAUSED" },
      { status: 400 },
    );
  }

  try {
    const result = await updateEntityDeliveryStatus({
      scope,
      entityId,
      status: body.status,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    const status =
      message === "Entity not found"
        ? 404
        : message.includes("Only campaigns")
          ? 400
          : 400;
    console.error("[adpilot] entity status:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
