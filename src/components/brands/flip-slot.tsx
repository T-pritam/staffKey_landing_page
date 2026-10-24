"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { MQ } from "@/lib/motion";

/** How long a card stays before the next one comes in. */
const HOLD_MS = 6500;
/** The reveal. Long enough to read as a curtain, short enough not to stall the grid. */
const REVEAL_MS = 1150;
/** Matches the hero curtain (globals.css) so the page moves with one hand. */
const CURTAIN = "cubic-bezier(0.77, 0, 0.18, 1)";
const SETTLE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** The cards' own corner radius (brand-card.tsx), so the wipe keeps the shape. */
const RADIUS = "28px";

/*
 * Three states, all inline so a card's visibility never waits on a stylesheet.
 *
 *   in    on top; its curtain opens upward and the card settles from a touch
 *         larger to its real size
 *   out   the card that was showing, held underneath; it sinks back and dims
 *         while the new one covers it, so there is never a moment where both
 *         are half-transparent
 *   idle  clipped away below, waiting, with no transition so it resets at once
 */
const STYLE: Record<"in" | "out" | "idle", CSSProperties> = {
  in: {
    zIndex: 2,
    clipPath: `inset(0% 0% 0% 0% round ${RADIUS})`,
    transform: "none",
    filter: "none",
    transition: `clip-path ${REVEAL_MS}ms ${CURTAIN}, transform ${REVEAL_MS + 400}ms ${SETTLE}`,
  },
  out: {
    zIndex: 1,
    clipPath: `inset(0% 0% 0% 0% round ${RADIUS})`,
    transform: "scale(0.94)",
    filter: "brightness(0.72) saturate(0.9)",
    transition: `transform ${REVEAL_MS}ms ${CURTAIN}, filter ${REVEAL_MS}ms ${CURTAIN}`,
  },
  idle: {
    zIndex: 0,
    clipPath: `inset(100% 0% 0% 0% round ${RADIUS})`,
    transform: "scale(1.06)",
    filter: "none",
  },
};

/** The card that was showing, held on top unmoving while the next one is reset below it. */
const HOLDING: CSSProperties = { ...STYLE.in, transition: "none" };

/**
 * One bento slot that turns over between property cards when there are more
 * cards than slots. The cards share one grid cell, so the slot keeps its size.
 *
 * Every turn runs in two steps. "prep": the incoming card is put back to its
 * clipped, waiting state with no transition, while the outgoing card stays on
 * top exactly as it was. Two frames later, "run": the incoming card's curtain
 * opens and the outgoing one sinks. Without the reset, a card coming round for
 * its second turn would still be fully open from last time and the change
 * would be a blink instead of a reveal.
 *
 * Each slot starts a little after the one before it (`offset`), so the grid
 * turns over in a ripple rather than all at once. Turning pauses while the
 * pointer or keyboard focus is inside the slot (without losing its place) and
 * stops while it is off-screen. Reduced motion shows the first card only.
 * Cards not on show are inert and hidden from assistive technology; the
 * wrapper, not the card, moves, so the cards' own entrance and tilt are
 * untouched.
 */
export function FlipSlot({ children, offset = 0 }: { children: ReactNode; offset?: number }) {
  const cards = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [{ index, prev, phase }, setTurn] = useState<{ index: number; prev: number | null; phase: "prep" | "run" }>({
    index: 0,
    prev: null,
    phase: "run",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || cards.length < 2 || window.matchMedia(MQ.reduce).matches) return;
    let timer: number | undefined;
    let delay: number | undefined;
    let elapsed = 0;
    let last = 0;
    // The hold counts only unpaused time, so hovering a slot does not cost the next card its turn.
    const step = () => {
      const now = performance.now();
      if (!paused.current) elapsed += now - last;
      last = now;
      if (elapsed >= HOLD_MS) {
        elapsed = 0;
        setTurn(({ index: i }) => ({ index: (i + 1) % cards.length, prev: i, phase: "prep" }));
      }
    };
    const stop = () => {
      window.clearTimeout(delay);
      window.clearInterval(timer);
    };
    const start = () => {
      stop();
      delay = window.setTimeout(() => {
        last = performance.now();
        elapsed = 0;
        timer = window.setInterval(step, 100);
      }, offset * 900);
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [cards.length, offset]);

  // Let the reset paint before the reveal starts (two frames: one to commit, one to paint).
  useEffect(() => {
    if (phase !== "prep") return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setTurn((current) => ({ ...current, phase: "run" })));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [phase, index]);

  if (cards.length < 2) return <>{cards}</>;

  const hold = () => (paused.current = true);
  const release = () => (paused.current = false);

  const styleFor = (i: number): CSSProperties | undefined => {
    // Before the first turn the first card wears no inline style, so its entrance runs untouched.
    if (prev === null) return i === index ? undefined : STYLE.idle;
    if (phase === "prep") return i === prev ? HOLDING : STYLE.idle;
    return i === index ? STYLE.in : i === prev ? STYLE.out : STYLE.idle;
  };

  return (
    <div
      ref={ref}
      className="grid h-full"
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocus={hold}
      onBlur={release}
    >
      {cards.map((card, i) => {
        const shown = i === index;
        return (
          <div
            key={i}
            style={styleFor(i)}
            aria-hidden={!shown}
            inert={!shown}
            className={`relative col-start-1 row-start-1 h-full will-change-[clip-path,transform] ${shown ? "" : "pointer-events-none"}`}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}
