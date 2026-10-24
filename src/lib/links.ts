import type { LandingLinks } from "@/lib/types";

/**
 * The Staffkey app this page links into. The landing page has no sign-in of
 * its own: every button leaves for the app, at the addresses an admin sets
 * under /admin/landing (served with the content, see src/lib/data.ts).
 *
 * STAFFKEY_APP_URL is the app's origin. It is also where the content comes
 * from. Unset, it is the staging app, whose routes were checked live:
 *   /login/employer   employer login (email and password)
 *   /signup/employer  employer registration
 *   /login/candidate  candidate phone-verification onboarding
 */
export const APP_URL = (process.env.STAFFKEY_APP_URL ?? "https://staging.staffkey.in").replace(/\/+$/, "");

/** Used only when the content cannot be fetched. */
export const FALLBACK_LINKS: LandingLinks = {
  employerLogin: `${APP_URL}/login/employer`,
  employerSignup: `${APP_URL}/signup/employer`,
  candidateWeb: `${APP_URL}/login/candidate`,
  candidateDownload: null,
  playStore: null,
  appStore: null,
};

export const STATIC_LINKS = {
  email: "ops.staffkey@gmail.com",
} as const;

/**
 * A fixed page of the app (privacy, terms) on the same app the admin's links
 * point at, so the footer never sends people to a different host than the
 * buttons do.
 */
export function appPage(links: LandingLinks, path: `/${string}`): string {
  try {
    return `${new URL(links.candidateWeb).origin}${path}`;
  } catch {
    return `${APP_URL}${path}`;
  }
}

/** In-page sections (their ids live in the section components). */
export const SECTIONS = {
  top: "#top",
  brands: "#brands",
  jobs: "#live-jobs",
  getStarted: "#for-employers",
} as const;
