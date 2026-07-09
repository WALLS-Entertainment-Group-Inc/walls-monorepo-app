import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Thread title generation is not implemented yet." },
    { status: 501 },
  );
}
