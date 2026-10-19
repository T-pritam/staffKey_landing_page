import { cacheLife } from "next/cache";

import { SAMPLE_BRANDS } from "@/data/brands";
import { SAMPLE_JOBS } from "@/data/jobs";
import type { Brand, Job, LiveStats } from "@/lib/types";

/**
 * The landing page's only data sources. Each returns sample data today; to go
 * live, replace the body with a fetch to the Staffkey API and keep the return
 * type. Components take the result as props, so nothing else changes.
 *
 *   const res = await fetch(`${process.env.STAFFKEY_API_URL}/public/live-jobs`);
 *   const page: { vacancies: Job[] } = await res.json();
 *   return page.vacancies;
 */

export async function getJobs(): Promise<Job[]> {
  "use cache";
  cacheLife("minutes");
  return SAMPLE_JOBS; // later: GET /public/live-jobs
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheLife("hours");
  return SAMPLE_BRANDS; // later: GET /public/brands
}

/** The hero's live numbers. Placeholder values until there is an endpoint. */
export async function getLiveStats(): Promise<LiveStats> {
  "use cache";
  cacheLife("minutes");
  return {
    availableNow: 1284,
    verifiedCandidates: 12400,
    partnerProperties: 380,
    cities: 24,
  };
}
