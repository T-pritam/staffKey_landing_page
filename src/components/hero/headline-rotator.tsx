"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { MQ } from "@/lib/motion";

const HOLD_MS = 5200;
const MOVE = "transform 0.9s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s ease";

const STYLE: Record<"in" | "out" | "idle", CSSProperties> = {
  in: { opacity: 1, transform: "none", transition: MOVE },
  out: { opacity: 0, transform: "translateY(-14%)", transition: MOVE },
  idle: { opacity: 0, transform: "translateY(14%)" },
};

/**
 * Rotates the hero headlines. All of them share one grid cell, so the block is
 * always as tall as the tallest and nothing below it moves.
 *
 * The first headline is the one in the server HTML and keeps the page's
 * rise-in animation. The heading's accessible name is every headline at once
 * (a screen reader should not hear it change under it); the rotating copies
 * are hidden from assistive technology. Stops while off-screen; reduced motion
 * shows the first headline only.
 */
export function HeadlineRotator({ label, headlines }: { label: string; headlines: ReactNode[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [{ index, prev }, setTick] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null });

  useEffect(() => {
    const el = ref.current;
    if (!el || headlines.length < 2 || window.matchMedia(MQ.reduce).matches) return;
    let timer: number | undefined;
    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      timer = window.setInterval(() => setTick(({ index: i }) => ({ index: (i + 1) % headlines.length, prev: i })), HOLD_MS);
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [headlines.length]);

  return (
    <>
      <span className="sr-only">{label}</span>
      <span ref={ref} aria-hidden className="grid">
        {headlines.map((headline, i) => {
          const state = i === index ? "in" : i === prev ? "out" : "idle";
          // Before the first swap the first headline carries no inline style, so its CSS rise-in runs untouched.
          const style = index === 0 && prev === null ? (i === 0 ? undefined : STYLE.idle) : STYLE[state];
          return (
            <span key={i} data-state={state} style={style} className="col-start-1 row-start-1">
              {headline}
            </span>
          );
        })}
      </span>
    </>
  );
}
