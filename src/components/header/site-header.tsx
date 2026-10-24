"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import { CandidateLink } from "@/components/links/candidate-link";
import { Logo } from "@/components/logo/logo";
import { SECTIONS, STATIC_LINKS } from "@/lib/links";
import type { LandingLinks } from "@/lib/types";
import { DUR, EASE, getLenis, gsap, MQ, onIdle, ScrollTrigger, scrollToTarget, STAGGER, useGSAP } from "@/lib/motion";

const NAV = [
  { label: "Jobs", href: SECTIONS.jobs },
  { label: "Brands", href: SECTIONS.brands },
] as const;

export function SiteHeader({ links }: { links: LandingLinks }) {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  // Shrink once the page moves; hide while reading down, return on the way up.
  useGSAP(
    (_, contextSafe) => {
      const el = pill.current;
      if (!el || !contextSafe) return;
      let hidden = false;
      let st: ScrollTrigger | undefined;
      const cancel = onIdle(
        contextSafe(() => {
          st = ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate(self) {
              const y = self.scroll();
              el.dataset.scrolled = y > 24 ? "true" : "false";
              const shouldHide = y > 320 && self.direction === 1;
              if (shouldHide !== hidden) {
                hidden = shouldHide;
                gsap.to(bar.current, { yPercent: hidden ? -160 : 0, duration: DUR.fast, ease: EASE.out, overwrite: true });
              }
            },
          });
        }),
      );
      return () => {
        cancel();
        st?.kill();
      };
    },
    { scope: root },
  );

  // The menu timeline is built once and played or reversed.
  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const links = el.querySelectorAll(".menu-word");
      const meta = el.querySelectorAll("[data-menu-meta]");
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        const reduce = ctx.conditions?.reduce;
        const tl = gsap.timeline({ paused: true });
        tl.set(el, { visibility: "visible" });
        if (reduce) {
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        } else {
          tl.fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: DUR.base, ease: EASE.expo },
          )
            .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: DUR.base, ease: EASE.expo, stagger: STAGGER.loose }, "-=0.55")
            .fromTo(meta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out, stagger: STAGGER.tight }, "-=0.6");
        }
        // A zero-length set at time 0 doesn't reliably undo on reverse; hide explicitly.
        tl.eventCallback("onReverseComplete", () => gsap.set(el, { visibility: "hidden" }));
        menuTl.current = tl;
      });
    },
    { scope: root },
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const tl = menuTl.current;
    const lenis = getLenis();
    if (open) {
      // Visible before focusing: hidden elements can't take focus.
      if (overlay.current) gsap.set(overlay.current, { visibility: "visible" });
      tl?.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      overlay.current?.querySelector<HTMLElement>("a, button")?.focus();
    } else {
      tl?.timeScale(1.6).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  // Focus stays inside the open menu; Esc closes it and returns focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !overlay.current) return;
      const items = Array.from(overlay.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The menu is phone-only; leaving that width must not strand it open.
  useEffect(() => {
    const mq = window.matchMedia(MQ.desktop);
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    // Let the menu start closing before the page moves.
    window.setTimeout(() => scrollToTarget(href), open ? 260 : 0);
  };

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      {/* Only this wrapper moves, so the fixed menu overlay below stays anchored to the viewport. */}
      <div ref={bar} className="relative z-[2] px-3 pt-[max(12px,env(safe-area-inset-top))] sm:px-4">
        <div
          ref={pill}
          data-scrolled="false"
          className="group/bar relative z-[2] mx-auto flex max-w-[1240px] items-center justify-between gap-3"
        >
          {/* The logo sits outside the capsule, larger; it gains its own glass once the page scrolls onto light sections. */}
          <a
            href={SECTIONS.top}
            onClick={(e) => onAnchor(e, SECTIONS.top)}
            className="flex min-h-[60px] items-center rounded-full px-1 transition-[background-color,padding,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-data-[scrolled=true]/bar:glass group-data-[scrolled=true]/bar:scale-[0.94] group-data-[scrolled=true]/bar:bg-[rgb(10_11_15/0.72)] group-data-[scrolled=true]/bar:px-5"
            aria-label="Staffkey, back to top"
          >
            <Logo tone="white" title={null} className="h-[28px] w-auto sm:h-[32px]" />
          </a>

          <div className="glass flex h-[60px] items-center gap-1 rounded-full pr-2 pl-2 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)] transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-data-[scrolled=true]/bar:scale-[0.965] group-data-[scrolled=true]/bar:border-[rgb(244_239_231/0.18)] group-data-[scrolled=true]/bar:bg-[rgb(10_11_15/0.72)] lg:pl-3">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => onAnchor(e, item.href)}
                      className="inline-flex min-h-11 items-center rounded-full px-4 text-[14px] text-on-dark-muted transition-colors hover:text-ivory"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <span aria-hidden className="mx-1 hidden h-6 w-px bg-line-dark lg:block" />

            <a
              href={links.employerLogin}
              className="hidden min-h-11 items-center rounded-full px-4 text-[14px] text-on-dark-muted ring-1 ring-line-dark transition-colors hover:text-ivory hover:ring-ivory/40 sm:inline-flex"
            >
              Employer login
            </a>
            <a
              href={SECTIONS.getStarted}
              onClick={(e) => onAnchor(e, SECTIONS.getStarted)}
              className="btn btn-primary hidden !min-h-11 !px-5 !text-[14px] sm:ml-1 sm:inline-flex"
            >
              Get started
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center rounded-full text-ivory transition-colors hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={overlay}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className="grain fixed inset-0 z-[1] flex flex-col bg-ink px-6 pt-[calc(96px+env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))] lg:hidden"
        style={{ visibility: "hidden" }}
      >
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[480px] rounded-full bg-blue/30 blur-[120px]" />
        <p data-menu-meta className="eyebrow mb-6 text-on-dark-faint">
          Menu
        </p>
        <nav aria-label="Mobile" className="relative">
          <ul className="flex flex-col gap-1">
            {[...NAV, { label: "Get started", href: SECTIONS.getStarted }, { label: "Employer login", href: links.employerLogin }].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => onAnchor(e, item.href)}
                  className="display flex min-h-14 items-center overflow-clip py-1 text-[clamp(36px,10vw,56px)] text-ivory"
                >
                  <span className="menu-word inline-block">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative mt-auto flex flex-col gap-3">
          <a data-menu-meta href={links.employerSignup} className="btn btn-primary w-full">
            I&rsquo;m hiring <ArrowUpRight className="btn-arrow size-4" aria-hidden />
          </a>
          <CandidateLink data-menu-meta links={links} className="btn btn-ghost w-full">
            Find a job
          </CandidateLink>
          <p data-menu-meta className="mt-3 font-mono text-[12px] text-on-dark-faint">
            {STATIC_LINKS.email}
          </p>
        </div>
        <button type="button" onClick={close} className="sr-only focus:not-sr-only">
          Close menu
        </button>
      </div>
    </header>
  );
}
