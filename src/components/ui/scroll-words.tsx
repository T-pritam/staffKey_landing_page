"use client";

import { useRef, type ElementType } from "react";

import { gsap, MQ, onIdle, useGSAP } from "@/lib/motion";

import { SplitWords, type SplitPart } from "./split-words";

/**
 * A headline whose words rise into place as it scrolls into view, as one
 * masked stagger. Reduced motion gets a plain fade.
 */
export function ScrollWords({
  as: Tag = "h2",
  parts,
  className,
  id,
}: {
  as?: ElementType;
  parts: SplitPart | SplitPart[];
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      return onIdle(
        contextSafe(() => {
          const words = el.querySelectorAll(".sw-word");
          const mm = gsap.matchMedia();
          mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
            if (ctx.conditions?.reduce) {
              gsap.from(el, { opacity: 0, duration: 0.5, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
              return;
            }
            gsap.fromTo(
              words,
              { yPercent: 115, rotate: 4 },
              {
                yPercent: 0,
                rotate: 0,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.06,
                scrollTrigger: { trigger: el, start: "top 82%", once: true },
              },
            );
          });
        }),
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      <SplitWords parts={parts} />
    </Tag>
  );
}
