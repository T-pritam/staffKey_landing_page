/**
 * The landing page's content, as the Staffkey app serves it from
 * GET /api/v1/public/landing (edited by an admin under /admin/landing).
 *
 * Mirrors `lib/landing-content/shared.ts` in the staffkey repo. That file is
 * the contract: fields are added there first, never renamed or removed
 * without changing this page in the same release.
 */

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "SEASONAL" | "APPRENTICESHIP";

export type PropertyTypeRef = { slug: string; name: string };

export type LandingCounters = {
  verifiedCandidates: number;
  partnerProperties: number;
  cities: number;
  availableNow: number;
};

/** Where each button goes. Null is "not set up yet". */
export type LandingLinks = {
  employerLogin: string;
  employerSignup: string;
  candidateWeb: string;
  candidateDownload: string | null;
  playStore: string | null;
  appStore: string | null;
};

export type ApiTrustedLogo = { id: string; name: string; logoUrl: string | null };

export type ApiPropertyCard = {
  id: string;
  name: string;
  propertyType: PropertyTypeRef | null;
  city: string;
  description: string | null;
  openings: number;
  logoUrl: string | null;
};

export type ApiJob = {
  id: string;
  title: string;
  role: string;
  department: string | null;
  propertyType: PropertyTypeRef | null;
  city: string;
  experience: { minMonths: number; maxMonths: number | null };
  positions: number;
  employmentType: EmploymentType;
  salary: { min: number; max: number } | null;
  sample: true;
};

export type LandingContent = {
  counters: LandingCounters;
  links: LandingLinks;
  trustedLogos: ApiTrustedLogo[];
  propertyCards: ApiPropertyCard[];
  jobs: ApiJob[];
};

// --- What the components draw ------------------------------------------------

/** A name with an optional logo: a marquee entry, or the top of a card. */
export type Mark = { id: string; name: string; logoSrc?: string };

export type Brand = Mark & {
  propertyType: string;
  propertyTypeSlug: string | null;
  city: string;
  openRoles: number;
  quote?: string;
};

export type Job = {
  id: string;
  role: string;
  title: string;
  department: string;
  experience: { minMonths: number; maxMonths: number | null };
  city: string;
  positions: number;
  propertyType: string | null;
  employmentType: EmploymentType;
  /** INR per month. Undefined is "Salary on request". */
  salary?: { min: number; max: number };
};

export type LiveStats = LandingCounters;
