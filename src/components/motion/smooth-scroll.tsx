"use client";

import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger, startSmoothScroll, useGSAP } from "@/lib/motion";

/**
 * Page-level motion plumbing: Lenis, the scroll-progress line, and keeping
 * ScrollTrigger's measurements honest after fonts, images and rotations.
 */
export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stop = startSmoothScroll();

    // ScrollTrigger refreshes itself on load and resize. Fonts can land after
    // load, and rotation can finish without a resize, so cover those two.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(() => {
      if (document.readyState === "complete") refresh();
    });
    const orientation = window.matchMedia("(orientation: portrait)");
    orientation.addEventListener("change", refresh);

    return () => {
      stop();
      orientation.removeEventListener("change", refresh);
    };
  }, []);

  useGSAP(() => {
    if (!bar.current) return;
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      }
    );
  });

  return (
    <div
      ref={bar}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-blue"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
