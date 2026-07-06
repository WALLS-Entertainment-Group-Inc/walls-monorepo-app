import { NextResponse } from "next/server";

import {
  getCurrentUserId,
  listSafeConnectionsForUser,
  revokeMetaConnection,
} from "@/lib/connections-server";
import { META_PROVIDER, META_SERVICE } from "@/lib/connections";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connections = await listSafeConnectionsForUser(userId);
  return NextResponse.json({ connections });
}

export async function DELETE(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    provider?: string;
    service?: string;
  };

  if (body.provider === META_PROVIDER && body.service === META_SERVICE) {
    await revokeMetaConnection(userId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported connection" }, { status: 400 });
}
