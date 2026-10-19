/**
 * Routes into the Staffkey app. The landing page links out; it has no sign-in
 * of its own. Set NEXT_PUBLIC_APP_URL to the app's origin in production.
 */
const APP = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const LINKS = {
  signIn: `${APP}/login`,
  hiring: `${APP}/signup/employer`,
  findJob: `${APP}/login/candidate`,
  allJobs: `${APP}/#live-jobs`,
  /** Same shape as the app's signupPathFor(): the vacancy rides through sign-up. */
  apply: (jobId: string) => `${APP}/login/candidate?apply=${encodeURIComponent(jobId)}`,
  privacy: `${APP}/legal/privacy`,
  terms: `${APP}/legal/terms`,
  email: "ops.staffkey@gmail.com",
} as const;
