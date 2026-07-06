import { NextResponse } from "next/server";

import {
  listCampaignPerformance,
  type CampaignEntityType,
} from "@/lib/campaigns-server";
import { getCurrentUserId } from "@/lib/connections-server";

const ENTITY_TYPES = new Set<CampaignEntityType>(["campaign", "ad_group", "ad"]);

export async function GET(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entityTypeParam = searchParams.get("type") ?? "campaign";
  const entityType = ENTITY_TYPES.has(entityTypeParam as CampaignEntityType)
    ? (entityTypeParam as CampaignEntityType)
    : "campaign";
  const search = searchParams.get("search") ?? undefined;
  const accountId = searchParams.get("accountId") ?? undefined;
  const page = Number(searchParams.get("page") ?? "0");

  try {
    const result = await listCampaignPerformance({
      userId,
      entityType,
      search,
      accountId,
      page: Number.isFinite(page) ? page : 0,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[adpilot] campaigns list:", error);
    return NextResponse.json({ error: "Failed to load campaigns" }, { status: 500 });
  }
}
