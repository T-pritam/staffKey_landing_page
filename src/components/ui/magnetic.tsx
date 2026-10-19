"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MQ, useGSAP } from "@/lib/motion";

/**
 * Pulls its child toward the pointer on desktop. Touch and reduced motion get
 * a plain, still button.
 */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.rich, () => {
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * strength);
          y((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`}>
      {children}
    </span>
  );
}
