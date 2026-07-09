import { type NextRequest } from "next/server";

import { handleProtectedAppRequest } from "@walls/auth/middleware";

/** Mobile voice routes authenticate via Bearer in the route handler. */
const MOBILE_BEARER_API_PREFIXES = ["/api/walli/transcribe", "/api/walli/tts"];

export async function middleware(request: NextRequest) {
  return handleProtectedAppRequest(request, {
    publicPaths: MOBILE_BEARER_API_PREFIXES,
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
