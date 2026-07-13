import { NextResponse } from "next/server";

import { getAdDataScope } from "@/lib/ad-scope";
import { syncMetaConnectionsForAccount } from "@/lib/meta-sync";

export async function POST() {
  const scope = await getAdDataScope();
  if (!scope) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncMetaConnectionsForAccount(scope);
  const failed = results.filter((result) => !result.ok);

  if (failed.length > 0 && failed.length === results.length) {
    return NextResponse.json(
      { error: failed[0]?.error ?? "Meta sync failed", results },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, results });
}
