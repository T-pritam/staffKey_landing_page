import type { Brand } from "@/lib/types";

import { MarqueeMotion } from "./marquee";
import { Wordmark } from "./wordmark";

/** Server-rendered marquee markup; MarqueeMotion only adds the movement. */
export function BrandMarquee({ brands }: { brands: Brand[] }) {
  const rows = [brands, [...brands].reverse()];
  return (
    <MarqueeMotion>
      <ul className="sr-only">
        {brands.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
      {rows.map((row, r) => (
        <div key={r} aria-hidden className="overflow-clip">
          <div data-track className="flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center">
                {row.map((brand) => (
                  <li
                    key={`${copy}-${brand.id}`}
                    className="flex items-center text-[clamp(26px,3.4vw,48px)] text-ink/60 transition-colors duration-500 hover:text-ink"
                  >
                    <span className="px-[clamp(20px,3vw,48px)] py-3">
                      <Wordmark brand={brand} index={brands.indexOf(brand)} />
                    </span>
                    <span className="text-[0.4em] text-champagne">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </MarqueeMotion>
  );
}
