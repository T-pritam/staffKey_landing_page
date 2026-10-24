import type { ReactNode } from "react";

import { ScrollWords } from "@/components/ui/scroll-words";
import type { Brand, Mark } from "@/lib/types";

import { BentoMotion } from "./bento-motion";
import { BrandCard } from "./brand-card";
import { FlipSlot } from "./flip-slot";
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
          className="display max-w-[22ch] text-balance text-[clamp(38px,5.6vw,80px)]"
          parts={["Hospitality’s best", { em: "kitchens" }, "and", { em: "lobbies" }, "hire here."]}
        />
      </div>
      {children}
    </section>
  );
}

/**
 * The scrolling trusted-by strip (`marks`) and the property-card bento
 * (`brands`), both admin-managed. Six slots; with more than six cards each
 * slot turns over between the cards that fall to it (card i goes to slot
 * i mod 6). Either part is left out while it has nothing published.
 */
export function BrandsSection({ marks, brands }: { marks: Mark[]; brands: Brand[] }) {
  if (marks.length === 0 && brands.length === 0) return <BrandsShell>{null}</BrandsShell>;
  const slots = SPANS.slice(0, Math.min(brands.length, SPANS.length)).map((_, slot) =>
    brands.map((brand, i) => ({ brand, i })).filter(({ i }) => i % SPANS.length === slot)
  );

  return (
    <BrandsShell>
      {marks.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <BrandMarquee brands={marks} />
        </div>
      )}

      {brands.length > 0 && (
        <div className="mx-auto mt-16 max-w-[1440px] px-[var(--gutter)] lg:mt-24">
          <BentoMotion className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            {slots.map((cards, slot) => (
              <div key={cards[0].brand.id} className={SPANS[slot]}>
                <FlipSlot offset={slot}>
                  {cards.map(({ brand, i }) => (
                    <BrandCard key={brand.id} brand={brand} index={i} featured={slot === 0} />
                  ))}
                </FlipSlot>
              </div>
            ))}
          </BentoMotion>
        </div>
      )}
    </BrandsShell>
  );
}
