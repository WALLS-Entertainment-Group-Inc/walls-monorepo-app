import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Wallie chat API is not implemented in this app yet. Set NEXT_PUBLIC_WALLIE_API_URL or migrate the /api/walli routes from the main app.",
    },
    { status: 501 },
  );
}
