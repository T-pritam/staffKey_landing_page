"use client";

import { useRef } from "react";

import { DUR, EASE, gsap, MQ, onIdle, useGSAP } from "@/lib/motion";

const fmt = new Intl.NumberFormat("en-IN");

/**
 * Renders the final number on the server (so it reads correctly without JS),
 * then counts up from zero the first time it scrolls into view.
 */
export function CountUp({
  value,
  suffix = "",
  className,
  delay = 0,
  start = "top 90%",
  defer = true,
}: {
  value: number;
  suffix?: string;
  className?: string;
  delay?: number;
  start?: string;
  /** Wait for idle before wiring up. Turn off for numbers above the fold. */
  defer?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const setup = contextSafe(() => {
        const mm = gsap.matchMedia();
        mm.add(MQ.motion, () => {
          const counter = { n: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(counter, {
            n: value,
            duration: DUR.slow * 1.6,
            delay,
            ease: EASE.expo,
            scrollTrigger: { trigger: el, start, once: true },
            onUpdate: () => {
              el.textContent = `${fmt.format(Math.round(counter.n))}${suffix}`;
            },
          });
          return () => {
            el.textContent = `${fmt.format(value)}${suffix}`;
          };
        });
      });
      if (!defer) {
        setup();
        return;
      }
      return onIdle(setup);
    },
    { dependencies: [value, suffix, defer] },
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
