"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";

import type { Flip } from "gsap/Flip";

import { DUR, EASE, gsap, loadFlip, MQ, onIdle, prefersReducedMotion, ScrollTrigger, STAGGER, useGSAP } from "@/lib/motion";

import { JOBS_PAGE as PAGE } from "./page-size";


/**
 * The filterable list. The rows arrive server-rendered as `children` (each an
 * `<li data-job data-dept>`), so the browser never re-renders them; filtering
 * and "View more" only toggle `hidden`, which lets GSAP Flip animate rows
 * leaving, entering and sliding into their new places.
 *
 * The department chips are the departments the rows carry, in the order they
 * first appear, so a department an admin uses gets a chip without a deploy.
 */
export function JobsBoard({ departments, children }: { departments: string[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<Flip.FlipState | null>(null);
  const flip = useRef<typeof Flip | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [limit, setLimit] = useState(PAGE);
  const chips = useMemo(() => ["All", ...new Set(departments)], [departments]);

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", departments.length]]);
    for (const d of departments) map.set(d, (map.get(d) ?? 0) + 1);
    return map;
  }, [departments]);

  const matching = counts.get(filter) ?? 0;
  const visible = Math.min(matching, limit);

  const capture = async () => {
    if (prefersReducedMotion()) return;
    const F = (flip.current ??= await loadFlip());
    pending.current = F.getState(gsap.utils.toArray<HTMLElement>("[data-job]", root.current));
  };

  const choose = async (dept: string) => {
    if (dept === filter) return;
    await capture();
    setFilter(dept);
    setLimit(PAGE);
  };

  const more = async () => {
    await capture();
    setLimit((n) => n + PAGE);
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
      let shown = 0;
      for (const row of gsap.utils.toArray<HTMLElement>("[data-job]", root.current)) {
        const matches = filter === "All" || row.dataset.dept === filter;
        row.hidden = !matches || shown >= limit;
        if (matches) shown += 1;
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
    { scope: root, dependencies: [filter, limit] },
  );

  return (
    <div ref={root}>
      <div className="-mx-[var(--gutter)] mt-10 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:mt-14 [&::-webkit-scrollbar]:hidden">
        <div role="group" aria-label="Filter jobs by department" className="flex w-max gap-2">
          {chips.map((dept) => {
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
        Showing {visible} of {matching} sample {matching === 1 ? "role" : "roles"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <ul className="relative mt-8 flex flex-col gap-3 lg:mt-10 lg:gap-0 lg:border-t lg:border-line-dark">
        {children}
      </ul>

      {matching > limit && (
        <div className="mt-10 flex justify-center lg:mt-14">
          <button type="button" onClick={() => void more()} className="btn btn-ghost">
            View more <span className="font-mono text-[13px] text-on-dark-faint">+{Math.min(PAGE, matching - limit)}</span>
            <ChevronDown className="btn-arrow size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
