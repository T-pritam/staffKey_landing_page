"use client";

import { useRef, type ReactNode } from "react";

import { EASE, gsap, MQ, onIdle, useGSAP } from "@/lib/motion";

/** When the CSS entrance (see .hero-* in globals.css) has finished. */
const INTRO_SECONDS = 1.6;

/**
 * The hero's motion after load. The entrance itself (curtain, photo settle,
 * word rise, fades) is CSS so it starts at first paint instead of waiting
 * for hydration, which keeps LCP close to FCP and works without JS. This adds
 * what needs JS: slow ambient breathing, desktop mouse parallax, and the
 * scroll hand-off to the next section.
 *
 * Two rules keep the CSS entrance from replaying:
 * - The desktop "pin" is CSS sticky (.hero-stick), not a ScrollTrigger pin.
 *   A pin re-parents the section, and moving an element restarts its CSS
 *   animations.
 * - GSAP never touches the <img>. GSAP clears the CSS `scale` property on
 *   anything it transforms, so the ambient zoom runs on the <picture> instead.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = scope.current;
      if (!root || !contextSafe) return;
      const q = gsap.utils.selector(root);
      const section = q("[data-hero]")[0] as HTMLElement;
      const shrink = q("[data-hero-shrink]");
      const parallax = q("[data-hero-parallax]");
      const picture = q("picture");
      const content = q("[data-hero-content]");
      const blooms = q("[data-bloom]");
      const dim = q("[data-hero-dim]");

      // Nothing here is needed for the first paint, so it waits for idle.
      return onIdle(
        contextSafe(() => {
          const mm = gsap.matchMedia();

          mm.add({ motion: MQ.motion, rich: MQ.rich }, (ctx) => {
            const { motion, rich } = ctx.conditions as Record<string, boolean>;
            if (!motion) return;

            // ---- ambient: slow breathing, paused off-screen ----
            const ambient = gsap.timeline({ paused: true });
            ambient
              .to(picture, { scale: 1.08, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
              .to(blooms[0], { xPercent: 22, yPercent: 14, scale: 1.15, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
              .to(blooms[1], { xPercent: -18, yPercent: -12, scale: 0.9, duration: 13, ease: "sine.inOut", repeat: -1, yoyo: true }, 0);

            let onScreen = true;
            let started = false;
            const start = gsap.delayedCall(INTRO_SECONDS, () => {
              started = true;
              if (onScreen) ambient.play();
            });
            const io = new IntersectionObserver(([e]) => {
              onScreen = e.isIntersecting;
              if (!started) return;
              if (onScreen) ambient.play();
              else ambient.pause();
            });
            io.observe(section);

            // ---- scroll: content lifts away, the photo settles into a card ----
            // Driven by the next section rising over the hero. On desktop the hero is
            // sticky, so its own position never changes and can't be the trigger.
            const next = document.getElementById("brands");
            const hide = (hidden: boolean) => {
              // Once fully covered, stop painting the hero and its loops.
              if (!rich) return;
              gsap.set(root, { visibility: hidden ? "hidden" : "visible" });
              if (!started) return;
              if (hidden) ambient.pause();
              else ambient.play();
            };
            const scroll = gsap.timeline({
              scrollTrigger: next
                ? { trigger: next, start: "top bottom", end: "top top", scrub: true, onLeave: () => hide(true), onEnterBack: () => hide(false) }
                : { trigger: section, start: "top top", end: "bottom top", scrub: true },
            });
            scroll
              .to(content, { yPercent: rich ? -18 : -8, opacity: 0, ease: "none" }, 0)
              .to(parallax, { yPercent: rich ? 6 : 10, ease: "none" }, 0);
            if (rich) {
              scroll
                .fromTo(
                  shrink,
                  { scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
                  { scale: 0.86, clipPath: "inset(0% 0% 0% 0% round 40px)", ease: "none" },
                  0,
                )
                .to(dim, { opacity: 0.55, ease: "none" }, 0);
            }

            // ---- desktop mouse parallax ----
            let cleanupPointer = () => {};
            if (rich) {
              const px = gsap.quickTo(parallax, "x", { duration: 1.2, ease: EASE.out });
              const py = gsap.quickTo(parallax, "y", { duration: 1.2, ease: EASE.out });
              const bx = gsap.quickTo(blooms, "x", { duration: 1.8, ease: EASE.out });
              const by = gsap.quickTo(blooms, "y", { duration: 1.8, ease: EASE.out });
              const move = (e: PointerEvent) => {
                const nx = e.clientX / window.innerWidth - 0.5;
                const ny = e.clientY / window.innerHeight - 0.5;
                px(nx * -22);
                py(ny * -14);
                bx(nx * 60);
                by(ny * 40);
              };
              section.addEventListener("pointermove", move);
              cleanupPointer = () => section.removeEventListener("pointermove", move);
            }

            return () => {
              start.kill();
              io.disconnect();
              cleanupPointer();
              gsap.set(root, { clearProps: "visibility" });
            };
          });
        }),
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="hero-stick">
      {children}
    </div>
  );
}
