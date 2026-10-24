import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { LANDING_CACHE_TAG } from "@/lib/data";

/**
 * Called by the Staffkey app after every landing-content save, so the change
 * shows on the next visit instead of after the five-minute refresh.
 *
 * Authenticated by a shared secret in `x-revalidate-secret`, the same value as
 * the app's LANDING_REVALIDATE_SECRET. Without LANDING_REVALIDATE_SECRET set
 * here the endpoint refuses everything.
 */
export async function POST(request: Request) {
  const expected = process.env.LANDING_REVALIDATE_SECRET ?? "";
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!expected || !same(given, expected)) {
    return Response.json({ error: "Not permitted" }, { status: 401 });
  }
  // Expire at once: the next request renders fresh content rather than one stale copy first.
  revalidateTag(LANDING_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
