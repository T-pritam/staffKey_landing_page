/**
 * Mirrors the Staffkey app's public `LiveJob` row, plus display-only fields
 * the landing page shows (title, department, type, salary).
 */
export type Job = {
  id: string;
  role: string;
  title: string;
  department: string;
  experience: { minMonths: number; maxMonths: number | null };
  city: string;
  positions: number;
  propertyType: string | null;
  employmentType?: "FULL_TIME" | "CONTRACT" | "SEASONAL";
  /** INR per month */
  salary?: { min: number; max: number };
};

export type Brand = {
  id: string;
  name: string;
  logoSrc?: string;
  propertyType: string;
  city: string;
  openRoles: number;
  quote?: string;
};

export type LiveStats = {
  availableNow: number;
  verifiedCandidates: number;
  partnerProperties: number;
  cities: number;
};
