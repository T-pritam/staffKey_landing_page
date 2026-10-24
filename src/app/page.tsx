import { Suspense } from "react";

import { BrandsSection } from "@/components/brands/brands-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/header/site-header";
import { Hero } from "@/components/hero/hero";
import { JobsSection } from "@/components/jobs/jobs-section";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { heroImage } from "@/data/hero-image";
import { getLandingContent, toBrands, toJobs, toMarks, toStats } from "@/lib/data";
import { STATIC_LINKS } from "@/lib/links";

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Staffkey",
  description: "Hospitality recruitment for Indian hotels and restaurants.",
  email: STATIC_LINKS.email,
  logo: "/brand/staffkey-black.svg",
  areaServed: "IN",
};

/**
 * The page reads one cached copy of the admin content (src/lib/data.ts). It is
 * filled at build time and refreshed in the background, so the prerendered
 * HTML already carries it and the fallback below is only seen while a
 * development server fetches it for the first time.
 */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />
      <SmoothScroll />
      <Suspense fallback={<div className="min-h-[100svh] bg-ink" aria-hidden />}>
        <LandingPage />
      </Suspense>
    </>
  );
}

async function LandingPage() {
  const content = await getLandingContent();
  const { links } = content;
  return (
    <>
      <SiteHeader links={links} />
      <main id="main">
        <Hero image={heroImage} stats={toStats(content)} links={links} />
        <BrandsSection marks={toMarks(content)} brands={toBrands(content)} />
        <JobsSection jobs={toJobs(content)} links={links} />
      </main>
      <SiteFooter links={links} />
    </>
  );
}
