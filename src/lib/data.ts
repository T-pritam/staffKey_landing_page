import { cacheLife, cacheTag } from "next/cache";

import { APP_URL, FALLBACK_LINKS } from "@/lib/links";
import type { Brand, Job, LandingContent, LiveStats, Mark } from "@/lib/types";

/**
 * The page's one data source: GET {STAFFKEY_APP_URL}/api/v1/public/landing,
 * which serves what an admin publishes under /admin/landing.
 *
 * How fresh it is:
 *   - Every admin save calls POST /api/revalidate here (src/app/api/revalidate),
 *     which drops the cached copy, so the next visitor sees the change.
 *   - If that call is missed, the copy refreshes on its own every five minutes.
 *
 * If the API cannot be reached the page still renders: the hero numbers are
 * hidden (zero), the buttons point at the app's own pages, and the jobs, cards
 * and logos sections show their empty states.
 */

export const LANDING_CACHE_TAG = "landing";

const EMPTY: LandingContent = {
  // Zero hides each number (see the hero): nothing unapproved is shown when the API is down.
  counters: { verifiedCandidates: 0, partnerProperties: 0, cities: 0, availableNow: 0 },
  links: FALLBACK_LINKS,
  trustedLogos: [],
  propertyCards: [],
  jobs: [],
};

const TIMEOUT_MS = 5_000;

export async function getLandingContent(): Promise<LandingContent> {
  "use cache";
  cacheTag(LANDING_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });

  try {
    const response = await fetch(`${APP_URL}/api/v1/public/landing`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    if (!response.ok) return EMPTY;
    const body = (await response.json()) as Partial<LandingContent>;
    return {
      counters: { ...EMPTY.counters, ...body.counters },
      links: { ...FALLBACK_LINKS, ...body.links },
      trustedLogos: Array.isArray(body.trustedLogos) ? body.trustedLogos : [],
      propertyCards: Array.isArray(body.propertyCards) ? body.propertyCards : [],
      jobs: Array.isArray(body.jobs) ? body.jobs : [],
    };
  } catch {
    return EMPTY;
  }
}

// --- Shaping the payload for the components ----------------------------------

export function toStats(content: LandingContent): LiveStats {
  return content.counters;
}

export function toMarks(content: LandingContent): Mark[] {
  return content.trustedLogos.map((logo) => ({ id: logo.id, name: logo.name, logoSrc: logo.logoUrl ?? undefined }));
}

export function toBrands(content: LandingContent): Brand[] {
  return content.propertyCards.map((card) => ({
    id: card.id,
    name: card.name,
    logoSrc: card.logoUrl ?? undefined,
    propertyType: card.propertyType?.name ?? "",
    propertyTypeSlug: card.propertyType?.slug ?? null,
    city: card.city,
    openRoles: card.openings,
    quote: card.description ?? undefined,
  }));
}

export function toJobs(content: LandingContent): Job[] {
  return content.jobs.map((job) => ({
    id: job.id,
    role: job.role,
    title: job.title,
    department: job.department ?? "Other",
    experience: job.experience,
    city: job.city,
    positions: job.positions,
    propertyType: job.propertyType?.name ?? null,
    employmentType: job.employmentType,
    salary: job.salary ?? undefined,
  }));
}
