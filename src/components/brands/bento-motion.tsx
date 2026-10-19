"use client";

import { useRef, type ReactNode } from "react";

import { DUR, EASE, gsap, MQ, onIdle, ScrollTrigger, STAGGER, useGSAP } from "@/lib/motion";

/** Staggered rise-in for the bento cards, plus spotlight and tilt on desktop. */
export function BentoMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;
      return onIdle(
        contextSafe(() => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-brand-card]", ref.current);
          const mm = gsap.matchMedia();

          mm.add(MQ.motion, () => {
            gsap.set(cards, { opacity: 0, y: 60 });
            ScrollTrigger.batch(cards, {
              start: "top 88%",
              once: true,
              onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.expo, stagger: STAGGER.loose }),
            });
          });

          mm.add(MQ.rich, () => {
            const offs = cards.map((card) => {
              const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: EASE.out });
              const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: EASE.out });
              gsap.set(card, { transformPerspective: 1100 });
              const move = (e: PointerEvent) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.setProperty("--mx", `${x * 100}%`);
                card.style.setProperty("--my", `${y * 100}%`);
                rx((0.5 - y) * 6);
                ry((x - 0.5) * 8);
              };
              const leave = () => {
                rx(0);
                ry(0);
              };
              card.addEventListener("pointermove", move);
              card.addEventListener("pointerleave", leave);
              return () => {
                card.removeEventListener("pointermove", move);
                card.removeEventListener("pointerleave", leave);
              };
            });
            return () => offs.forEach((off) => off());
          });
        }),
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
