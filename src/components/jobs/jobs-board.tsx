"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";

import type { Flip } from "gsap/Flip";

import { DUR, EASE, gsap, loadFlip, MQ, onIdle, prefersReducedMotion, ScrollTrigger, STAGGER, useGSAP } from "@/lib/motion";

const DEPARTMENTS = ["All", "Food Production", "F&B Service", "Front Office", "Housekeeping", "Kitchen Stewarding"] as const;

/**
 * The filterable list. The rows arrive server-rendered as `children` (each an
 * `<li data-job data-dept>`), so the browser never re-renders them; filtering
 * only toggles `hidden`, which lets GSAP Flip animate rows leaving, entering
 * and sliding into their new places.
 */
export function JobsBoard({ departments, children }: { departments: string[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<Flip.FlipState | null>(null);
  const flip = useRef<typeof Flip | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", departments.length]]);
    for (const d of departments) map.set(d, (map.get(d) ?? 0) + 1);
    return map;
  }, [departments]);

  const visible = counts.get(filter) ?? 0;

  const choose = async (dept: string) => {
    if (dept === filter) return;
    if (!prefersReducedMotion()) {
      const F = (flip.current ??= await loadFlip());
      pending.current = F.getState(gsap.utils.toArray<HTMLElement>("[data-job]", root.current));
    }
    setFilter(dept);
  };

  // Rows slide in the first time the list scrolls into view.
  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;
      return onIdle(
        contextSafe(() => {
          void loadFlip().then((F) => (flip.current = F));
          const rows = gsap.utils.toArray<HTMLElement>("[data-job]", root.current);
          const mm = gsap.matchMedia();
          mm.add(MQ.motion, () => {
            gsap.set(rows, { opacity: 0, y: 40 });
            ScrollTrigger.batch(rows, {
              start: "top 92%",
              once: true,
              onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.expo, stagger: STAGGER.base }),
            });
          });
        }),
      );
    },
    { scope: root },
  );

  // Apply the filter to the rows, then animate from the old layout.
  useGSAP(
    () => {
      for (const row of gsap.utils.toArray<HTMLElement>("[data-job]", root.current)) {
        row.hidden = filter !== "All" && row.dataset.dept !== filter;
      }
      const state = pending.current;
      const F = flip.current;
      if (!state || !F) return;
      pending.current = null;
      F.from(state, {
        duration: DUR.base,
        ease: EASE.expo,
        absolute: true,
        nested: true,
        prune: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, delay: 0.1 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3, ease: "power1.out" }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: root, dependencies: [filter] },
  );

  return (
    <div ref={root}>
      <div className="-mx-[var(--gutter)] mt-10 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:mt-14 [&::-webkit-scrollbar]:hidden">
        <div role="group" aria-label="Filter jobs by department" className="flex w-max gap-2">
          {DEPARTMENTS.map((dept) => {
            const n = counts.get(dept) ?? 0;
            const active = filter === dept;
            return (
              <button
                key={dept}
                type="button"
                aria-pressed={active}
                disabled={n === 0}
                onClick={() => choose(dept)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[14px] transition-[background-color,color,border-color] duration-300 disabled:opacity-40 ${
                  active ? "border-ivory bg-ivory text-ink" : "border-line-dark text-on-dark-muted hover:border-ivory/40 hover:text-ivory"
                }`}
              >
                {dept}
                <span className={`font-mono text-[12px] ${active ? "text-ink/60" : "text-on-dark-faint"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible} {visible === 1 ? "role" : "roles"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <ul className="relative mt-8 flex flex-col gap-3 lg:mt-10 lg:gap-0 lg:border-t lg:border-line-dark">
        {children}
      </ul>
    </div>
  );
}
