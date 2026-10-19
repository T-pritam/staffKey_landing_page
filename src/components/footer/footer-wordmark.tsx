"use client";

import { useRef } from "react";

import { Logo } from "@/components/logo/logo";
import { LOGO_SILHOUETTE, LOGO_VIEWBOX } from "@/components/logo/paths";
import { gsap, MQ, onIdle, useGSAP } from "@/lib/motion";

/**
 * The oversized footer wordmark: an outline, with a solid copy on top that is
 * wiped in from the left as the footer scrolls into view.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const fill = ref.current?.querySelector("[data-fill]");
      if (!fill || !contextSafe) return;
      return onIdle(
        contextSafe(() => {
          const mm = gsap.matchMedia();
          mm.add(MQ.motion, () => {
            gsap.fromTo(
              fill,
              { clipPath: "inset(0% 100% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
              },
            );
          });
        }),
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="relative w-full select-none">
      <svg viewBox={LOGO_VIEWBOX} className="block h-auto w-full overflow-visible">
        <path
          d={LOGO_SILHOUETTE}
          fillRule="evenodd"
          fill="none"
          stroke="rgb(244 239 231 / 0.28)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div data-fill className="absolute inset-0">
        <Logo tone="white" title={null} className="block h-auto w-full" />
      </div>
    </div>
  );
}
