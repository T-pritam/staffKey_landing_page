import { Suspense } from "react";

import { BrandsSection, BrandsSkeleton } from "@/components/brands/brands-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/header/site-header";
import { Hero } from "@/components/hero/hero";
import { JobsSection, JobsSkeleton } from "@/components/jobs/jobs-section";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { heroImage } from "@/data/hero-image";
import { getBrands, getJobs, getLiveStats } from "@/lib/data";
import { LINKS } from "@/lib/links";

async function Brands() {
  return <BrandsSection brands={await getBrands()} />;
}

async function Jobs() {
  return <JobsSection jobs={await getJobs()} />;
}

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Staffkey",
  description: "Hospitality recruitment for Indian hotels and restaurants.",
  email: LINKS.email,
  logo: "/brand/staffkey-black.svg",
  areaServed: "IN",
};

export default async function Home() {
  // Outside Suspense on purpose: the hero is the LCP, so it must be in the first
  // HTML paint, not streamed in behind a fallback. getLiveStats() is cached, so
  // this doesn't make the page dynamic.
  const stats = await getLiveStats();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <Hero image={heroImage} stats={stats} />
        <Suspense fallback={<BrandsSkeleton />}>
          <Brands />
        </Suspense>
        <Suspense fallback={<JobsSkeleton />}>
          <Jobs />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
