export const WALLS_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_WALLS_PUBLIC_SITE_URL ??
  "https://wallsentertainment.com";

export function publicSitePath(path: string): string {
  const base = WALLS_PUBLIC_SITE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
