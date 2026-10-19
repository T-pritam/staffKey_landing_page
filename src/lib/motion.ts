import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

type FlipPlugin = typeof import("gsap/Flip").Flip;
let flip: Promise<FlipPlugin> | null = null;

/** Flip is only needed once someone filters, so it loads on demand. */
export function loadFlip(): Promise<FlipPlugin> {
  flip ??= import("gsap/Flip").then(({ Flip }) => {
    gsap.registerPlugin(Flip);
    return Flip;
  });
  return flip;
}

/** One motion language for the whole page. */
export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
} as const;

export const DUR = {
  fast: 0.6,
  base: 0.85,
  slow: 1.1,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.075,
  loose: 0.09,
} as const;

/**
 * Media-query conditions for gsap.matchMedia(). "rich" is a real pointer on a
 * big screen with motion allowed: the only place for pinning, parallax,
 * magnetic buttons and tilt.
 */
export const MQ = {
  rich: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
} as const;

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
}

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis, and every Lenis scroll
 * tells ScrollTrigger to update, so pinned and scrubbed effects never lag the
 * page by a frame. Touch keeps native scrolling, which feels better on phones.
 */
export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Runs `cb` once the browser is idle (or after `timeout` ms at the latest).
 * Below-the-fold motion waits for this so first load stays responsive.
 */
export function onIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}

/** Smooth-scroll to an in-page anchor, accounting for the floating header. */
export function scrollToTarget(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (!lenis) {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  const smooth = lenis;
  smooth.scrollTo(el, {
    offset: -24,
    duration: 1.4,
    // Sections above the target may have rendered on the way (content-visibility),
    // shifting it. Settle on its real position.
    onComplete: () => {
      if (Math.abs(el.getBoundingClientRect().top - 24) > 4) smooth.scrollTo(el, { offset: -24, duration: 0.5 });
    },
  });
}
