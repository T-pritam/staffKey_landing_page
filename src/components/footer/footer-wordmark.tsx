"use client";

import { useRef } from "react";

import { Logo } from "@/components/logo/logo";
import { LOGO_SILHOUETTE, LOGO_VIEWBOX } from "@/components/logo/paths";
import { DUR, gsap, MQ, onIdle, useGSAP } from "@/lib/motion";

/**
 * The oversized footer wordmark: an outline, with a solid copy on top that
 * sweeps in from the left once the wordmark is mostly in view.
 *
 * Timed, not scroll-scrubbed: the footer sits at the very end of the page, so
 * a scrub only completes on the last pixel of scroll and most visitors would
 * see a half-filled logo.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const fill = el?.querySelector("[data-fill]");
      if (!el || !fill || !contextSafe) return;
      return onIdle(
        contextSafe(() => {
          const mm = gsap.matchMedia();
          mm.add(MQ.motion, () => {
            const sweep = gsap.fromTo(
              fill,
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow * 1.5, ease: "power2.inOut", paused: true },
            );
            // An observer, not a ScrollTrigger: the footer skips layout until it's near
            // (content-visibility), so positions measured at load are wrong.
            const io = new IntersectionObserver(
              ([entry]) => {
                if (!entry.isIntersecting) return;
                sweep.play();
                io.disconnect();
              },
              { threshold: 0.6 },
            );
            io.observe(el);
            return () => io.disconnect();
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
