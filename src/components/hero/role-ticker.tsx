"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MQ } from "@/lib/motion";

const HOLD_MS = 2400;

const MOVE = "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.45s ease";

/*
 * Inline rather than in globals.css, so a word's visibility never depends on
 * a stylesheet arriving (or hot-reloading) separately from this component.
 * Idle words wait invisible below the line with no transition, so a word that
 * just left resets instantly; the current word slides up, the previous fades out the top.
 */
const STYLE: Record<"in" | "out" | "idle", CSSProperties> = {
  in: { opacity: 1, transform: "none", transition: MOVE },
  out: { opacity: 0, transform: "translateY(-105%)", transition: MOVE },
  idle: { opacity: 0, transform: "translateY(105%)" },
};

/**
 * Cycles role names with a vertical swap. All words share one grid cell, so
 * the box is always as wide as the longest word and nothing beside it shifts.
 *
 * Only two words are ever visible: the current one and, during the swap, the
 * one leaving. Every other word is fully transparent, so nothing can pile up
 * above the line even where clipping is imperfect. Stops when off-screen;
 * reduced motion shows the first word only.
 */
export function RoleTicker({ words, className }: { words: string[]; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [{ index, prev }, setTick] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null });

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2 || window.matchMedia(MQ.reduce).matches) return;

    let timer: number | undefined;
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      timer = window.setInterval(() => {
        setTick(({ index: i }) => ({ index: (i + 1) % words.length, prev: i }));
      }, HOLD_MS);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [words.length]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      {/* clip-path, not just overflow: Chrome can let animating children escape an overflow clip. */}
      <span ref={ref} aria-hidden className="inline-grid overflow-clip pr-[0.08em] pb-[0.08em] align-bottom [clip-path:inset(0_-0.3em)]">
        {words.map((w, i) => {
          const state = i === index ? "in" : i === prev ? "out" : "idle";
          return (
            <span key={w} data-state={state} style={STYLE[state]} className="col-start-1 row-start-1 whitespace-nowrap">
              {w}
            </span>
          );
        })}
      </span>
    </span>
  );
}
