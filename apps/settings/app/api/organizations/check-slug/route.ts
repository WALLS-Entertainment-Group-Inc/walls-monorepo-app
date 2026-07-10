import { NextResponse } from "next/server";

import {
  isOrganizationSlugAvailable,
  normalizeOrganizationSlug,
} from "@/lib/organizations";
import { getCurrentUserId } from "@/lib/session";

export async function GET(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const excludeOrganizationId = searchParams.get("excludeOrganizationId");

  const normalized = normalizeOrganizationSlug(slug);
  if (!normalized) {
    return NextResponse.json({
      available: false,
      normalized: null,
      reason: "invalid",
    });
  }

  const available = await isOrganizationSlugAvailable(
    normalized,
    excludeOrganizationId ?? undefined,
  );

  return NextResponse.json({
    available,
    normalized,
    reason: available ? null : "taken",
  });
}
