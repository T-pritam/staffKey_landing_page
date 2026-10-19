"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MQ, onIdle, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Motion for the brand marquee (markup in marquee-rows.tsx): two rows drift
 * in opposite directions, scrolling speeds them up, hovering a row slows it
 * to a stop, and both pause off-screen. Each `[data-track]` holds its row twice.
 */
export function MarqueeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      return onIdle(
        contextSafe(() => {
          const mm = gsap.matchMedia();
          mm.add(MQ.motion, () => {
            const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", el);
            const loops = tracks.map((track, i) => {
              const dir = i % 2 === 0 ? -1 : 1;
              // Each track holds the row twice; moving by half its width loops seamlessly.
              return gsap.fromTo(
                track,
                { xPercent: dir === -1 ? 0 : -50 },
                { xPercent: dir === -1 ? -50 : 0, duration: 46 + i * 6, ease: "none", repeat: -1 },
              );
            });

            const hovered = new Set<number>();
            const settle = (i: number) =>
              gsap.to(loops[i], { timeScale: hovered.has(i) ? 0 : 1, duration: 0.8, ease: "power2.out", overwrite: true });

            const st = ScrollTrigger.create({
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              onUpdate(self) {
                const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
                loops.forEach((loop, i) => {
                  if (hovered.has(i)) return;
                  gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => settle(i) });
                });
              },
              onToggle(self) {
                loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause()));
              },
            });

            const handlers = tracks.map((track, i) => {
              const row = track.parentElement as HTMLElement;
              const enter = () => {
                hovered.add(i);
                settle(i);
              };
              const leave = () => {
                hovered.delete(i);
                settle(i);
              };
              row.addEventListener("pointerenter", enter);
              row.addEventListener("pointerleave", leave);
              return () => {
                row.removeEventListener("pointerenter", enter);
                row.removeEventListener("pointerleave", leave);
              };
            });

            return () => {
              st.kill();
              handlers.forEach((off) => off());
            };
          });
        }),
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="edge-fade flex flex-col gap-3 py-2 sm:gap-5" aria-label="Brands hiring on Staffkey" role="region">
      {children}
    </div>
  );
}
