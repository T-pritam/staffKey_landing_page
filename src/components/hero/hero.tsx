import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import type { CSSProperties } from "react";

import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitWords } from "@/components/ui/split-words";
import type { HeroImage } from "@/data/hero-image";
import { formatNumber } from "@/lib/format";
import { LINKS } from "@/lib/links";
import type { LiveStats } from "@/lib/types";

import { HeroMotion } from "./hero-motion";
import { RoleTicker } from "./role-ticker";

const ROLES = ["Sous Chefs", "Captains", "Front Office", "Housekeeping", "Commis", "Stewards", "Bartenders"];

// Phones and portrait tablets get the portrait crop.
const PORTRAIT = "(max-width: 1023px) and (orientation: portrait)";

export function Hero({ image, stats }: { image: HeroImage; stats: LiveStats }) {
  const common = { alt: image.alt, sizes: "100vw", quality: 80 } as const;
  const {
    props: { srcSet: desktopSet, ...img },
  } = getImageProps({ ...common, src: image.src, width: image.width, height: image.height });
  const mobileSet = image.mobileSrc
    ? getImageProps({
        ...common,
        quality: 70,
        src: image.mobileSrc,
        width: image.mobileWidth ?? image.width,
        height: image.mobileHeight ?? image.height,
      }).props.srcSet
    : undefined;

  // The photo is the LCP element: start both crops early, each only where it applies.
  preload(image.src, { as: "image", imageSrcSet: desktopSet, imageSizes: "100vw", fetchPriority: "high", media: mobileSet ? `not all and ${PORTRAIT}` : undefined });
  if (mobileSet && image.mobileSrc) {
    preload(image.mobileSrc, { as: "image", imageSrcSet: mobileSet, imageSizes: "100vw", fetchPriority: "high", media: PORTRAIT });
  }

  const vars = {
    "--fp-d": image.focalPoint.desktop,
    "--fp-m": image.focalPoint.mobile,
    "--blur-d": `url("${image.blurDataURL}")`,
    "--blur-m": `url("${image.mobileBlurDataURL ?? image.blurDataURL}")`,
  } as CSSProperties;

  return (
    <HeroMotion>
      <section
        id="top"
        aria-labelledby="hero-title"
        data-hero
        className="relative isolate flex min-h-[100svh] flex-col overflow-clip bg-ink text-ivory"
        style={vars}
      >
        {/* ---- the photograph ---- */}
        <div data-hero-frame className="hero-curtain absolute inset-0 overflow-clip">
          <div data-hero-shrink className="absolute inset-0 overflow-clip">
            <div data-hero-parallax className="hero-blur absolute -inset-[3%] bg-cover bg-center">
              <picture className="block h-full w-full">
                {mobileSet && <source media={PORTRAIT} srcSet={mobileSet} sizes="100vw" />}
                <img
                  {...img}
                  srcSet={desktopSet}
                  alt={image.alt}
                  data-hero-img
                  loading="eager"
                  fetchPriority="high"
                  className="hero-img hero-settle h-full w-full object-cover"
                />
              </picture>
            </div>

            {/* contrast: a heavy floor and a soft left wall for the type */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_8_11/0.55)_0%,rgb(7_8_11/0.1)_28%,rgb(7_8_11/0.2)_52%,rgb(7_8_11/0.92)_88%,#07080B_100%)]" />
            {/* portrait crops put busy detail behind the headline, so phones get a deeper top wash */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_8_11/0.9)_0%,rgb(7_8_11/0.72)_36%,rgb(7_8_11/0.12)_58%,transparent_70%)] lg:hidden" />
            <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(7_8_11/0.85)_0%,rgb(7_8_11/0.45)_38%,transparent_62%)] lg:block" />

            {/* drifting light: one blue, one champagne */}
            <div aria-hidden data-bloom="blue" className="absolute top-[8%] left-[-12%] size-[min(70vw,760px)] rounded-full bg-[radial-gradient(closest-side,rgb(18_63_240/0.36),transparent)]" />
            <div aria-hidden data-bloom="gold" className="absolute right-[-8%] bottom-[18%] size-[min(60vw,620px)] rounded-full bg-[radial-gradient(closest-side,rgb(217_179_106/0.22),transparent)]" />

            <div aria-hidden className="grain absolute inset-0" />
            <div aria-hidden data-hero-dim className="absolute inset-0 bg-ink opacity-0" />
          </div>
        </div>

        {/* ---- the words ---- */}
        <div
          data-hero-content
          className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between gap-10 px-[var(--gutter)] pt-[calc(108px+env(safe-area-inset-top))] pb-[calc(56px+env(safe-area-inset-bottom))] lg:justify-end lg:pt-[140px] lg:pb-8"
        >
          <div className="flex flex-col items-start">
            <p
              data-hero-fade
              className="hero-fade glass mb-6 inline-flex min-h-9 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-[14px] text-ivory lg:mb-8"
            >
              <span className="pulse-dot" aria-hidden />
              <span>
                <strong className="font-mono font-medium">{formatNumber(stats.availableNow)}</strong> verified candidates available now
              </span>
            </p>

            <h1 id="hero-title" className="hero-rise display max-w-[14ch] text-[clamp(44px,9vw,104px)]">
              <span className="block">
                <SplitWords parts={["The right", { em: "hands" }]} />
              </span>
              <span className="block">
                <SplitWords parts="for every hotel." start={3} />
              </span>
            </h1>

            <div className="mt-6 grid w-full gap-6 lg:mt-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:items-end lg:gap-16">
              <div data-hero-fade className="hero-fade" style={{ "--d": 1 } as CSSProperties}>
                <p className="max-w-[30rem] text-[16px] leading-[1.55] text-on-dark-muted lg:text-[18px]">
                  Hospitality recruitment for Indian hotels. Verified candidate profiles, released to you the moment you need them.
                </p>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="eyebrow text-on-dark-faint">Live now</span>
                  <RoleTicker words={ROLES} className="display text-[clamp(24px,2.6vw,34px)] text-champagne italic" />
                </p>
              </div>

              <div data-hero-fade className="hero-fade flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-self-end" style={{ "--d": 2 } as CSSProperties}>
                <Magnetic className="w-full sm:w-auto">
                  <a href={LINKS.hiring} className="btn btn-primary w-full sm:w-auto">
                    I&rsquo;m hiring <ArrowUpRight className="btn-arrow size-4" aria-hidden />
                  </a>
                </Magnetic>
                <Magnetic className="w-full sm:w-auto">
                  <a href={LINKS.findJob} className="btn btn-ghost w-full sm:w-auto">
                    Find a job
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <div
            data-hero-fade
            style={{ "--d": 3 } as CSSProperties}
            className="hero-fade grid w-full gap-4 border-t border-line-dark pt-5 lg:mt-14 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <p className="order-2 hidden items-center gap-2 font-mono text-[12px] tracking-wide text-on-dark-faint lg:order-1 lg:flex">
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-champagne" />
              {image.caption}
            </p>
            <dl className="order-1 grid grid-cols-3 gap-3 lg:order-2 lg:flex lg:gap-14">
              {[
                { label: "Verified candidates", value: stats.verifiedCandidates, suffix: "+" },
                { label: "Partner properties", value: stats.partnerProperties },
                { label: "Cities", value: stats.cities },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-[12px] leading-tight text-on-dark-faint sm:text-[12px]">{s.label}</dt>
                  <dd className="font-mono text-[clamp(20px,2vw,28px)] font-medium tracking-tight text-ivory">
                    <CountUp value={s.value} suffix={s.suffix} delay={1.2} start="top bottom" defer={false} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </HeroMotion>
  );
}
