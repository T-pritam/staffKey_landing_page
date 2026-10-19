import type { ReactNode } from "react";

import { ScrollWords } from "@/components/ui/scroll-words";
import type { Brand } from "@/lib/types";

import { BentoMotion } from "./bento-motion";
import { BrandCard } from "./brand-card";
import { BrandMarquee } from "./marquee-rows";

/** Bento placement: one tall feature, then a 5/5 pair beside it, then thirds. */
const SPANS = [
  "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "md:col-span-2 lg:col-span-4",
];

export function BrandsShell({ children }: { children: ReactNode }) {
  return (
    <section
      id="brands"
      aria-labelledby="brands-title"
      className="defer-render relative z-10 -mt-8 overflow-clip rounded-t-[32px] bg-ivory [--defer-h:3600px] lg:[--defer-h:2700px] pt-24 pb-24 text-ink sm:pt-32 lg:mt-0 lg:rounded-t-[48px] lg:pt-40 lg:pb-36"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <p className="eyebrow mb-6 flex items-center gap-3 text-on-light-muted">
          <span aria-hidden className="h-px w-8 bg-ink/30" />
          Trusted by
        </p>
        <ScrollWords
          id="brands-title"
          className="display max-w-[16ch] text-[clamp(38px,5.6vw,80px)]"
          parts={["Hospitality’s best", { em: "kitchens" }, "and", { em: "lobbies" }, "hire here."]}
        />
      </div>
      {children}
    </section>
  );
}

export function BrandsSection({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return <BrandsShell>{null}</BrandsShell>;
  const featured = brands.slice(0, 6);

  return (
    <BrandsShell>
      <div className="mt-16 lg:mt-24">
        <BrandMarquee brands={brands} />
      </div>

      <div className="mx-auto mt-16 max-w-[1440px] px-[var(--gutter)] lg:mt-24">
        <BentoMotion className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {featured.map((brand, i) => (
            <div key={brand.id} className={SPANS[i]}>
              <BrandCard brand={brand} index={i} featured={i === 0} />
            </div>
          ))}
        </BentoMotion>
      </div>
    </BrandsShell>
  );
}

export function BrandsSkeleton() {
  return (
    <BrandsShell>
      <div aria-hidden className="mx-auto mt-16 max-w-[1440px] px-[var(--gutter)] lg:mt-24">
        <div className="mb-16 h-[120px] animate-pulse rounded-full bg-ink/5" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {SPANS.map((span, i) => (
            <div key={i} className={`${span} min-h-[300px] animate-pulse rounded-[28px] bg-ink/[0.06] ${i === 0 ? "lg:min-h-[620px]" : ""}`} />
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">
        Loading brands
      </p>
    </BrandsShell>
  );
}
