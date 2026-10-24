import {
  BedDouble,
  Beer,
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  ChefHat,
  Coffee,
  CookingPot,
  Crown,
  Flower2,
  Gem,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  Martini,
  PartyPopper,
  Plane,
  Presentation,
  Sandwich,
  Ship,
  Soup,
  TreePalm,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";

import { CountUp } from "@/components/ui/count-up";
import type { Brand } from "@/lib/types";

import { Wordmark } from "./wordmark";

/**
 * An icon for each of the app's property types (EmployerType slugs). A
 * placeholder set until the agreed name/icon mapping arrives; a slug not
 * listed falls back to the name patterns below, then to a building.
 */
const ICON_BY_SLUG: Record<string, LucideIcon> = {
  hotel: Building2,
  resort: TreePalm,
  restaurant: UtensilsCrossed,
  qsr: Sandwich,
  caf: Coffee,
  "cloud-kitchen": ChefHat,
  "banquet-venue": PartyPopper,
  "convention-centre": Presentation,
  caterer: CookingPot,
  "wedding-caterer": Gem,
  "event-company": CalendarDays,
  club: Martini,
  pub: Beer,
  bar: Wine,
  "institutional-catering": Soup,
  "corporate-cafeteria": BriefcaseBusiness,
  hospital: Hospital,
  university: GraduationCap,
  "airport-hospitality": Plane,
  "cruise-operator": Ship,
  "serviced-apartments": Building,
  hostel: BedDouble,
  "senior-living": HeartHandshake,
  "luxury-residence": Crown,
};

const ICONS: [RegExp, LucideIcon][] = [
  [/heritage/i, Landmark],
  [/business/i, BriefcaseBusiness],
  [/resort/i, TreePalm],
  [/cloud/i, ChefHat],
  [/boutique/i, Flower2],
  [/bar/i, Wine],
  [/restaurant/i, UtensilsCrossed],
];

function PropertyIcon({ type, slug }: { type: string; slug: string | null }) {
  const Icon = (slug ? ICON_BY_SLUG[slug] : undefined) ?? ICONS.find(([re]) => re.test(type))?.[1] ?? Building2;
  return <Icon className="size-5" aria-hidden strokeWidth={1.5} />;
}

/** Six surfaces drawn from the palette; dark ones and light ones alternate. */
const SURFACES = [
  { bg: "bg-ink-3 bg-[radial-gradient(120%_90%_at_100%_0%,rgb(18_63_240/0.55),transparent_60%)]", tone: "dark" },
  { bg: "bg-blue bg-[radial-gradient(90%_80%_at_0%_100%,rgb(7_8_11/0.55),transparent_70%)]", tone: "dark" },
  { bg: "bg-ivory bg-[radial-gradient(90%_90%_at_100%_100%,rgb(217_179_106/0.45),transparent_65%)]", tone: "light" },
  { bg: "bg-ink bg-[radial-gradient(100%_80%_at_0%_0%,rgb(217_179_106/0.32),transparent_60%)]", tone: "dark" },
  { bg: "bg-champagne bg-[radial-gradient(90%_90%_at_100%_0%,rgb(255_255_255/0.45),transparent_60%)]", tone: "light" },
  { bg: "bg-ivory-3 bg-[radial-gradient(100%_100%_at_0%_100%,rgb(18_63_240/0.18),transparent_60%)]", tone: "light" },
] as const;

/** A different abstract pattern per card, drawn in currentColor. */
function Pattern({ variant }: { variant: number }) {
  const common = "pointer-events-none absolute opacity-[0.16]";
  switch (variant % 6) {
    case 0:
      return (
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className={`${common} -right-24 -bottom-24 size-[min(90%,520px)]`}
          fill="none"
          stroke="currentColor"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx="400" cy="400" r={40 + i * 40} strokeWidth="1" />
          ))}
        </svg>
      );
    case 1:
      return (
        <div
          aria-hidden
          className={`${common} -right-6 -bottom-6 size-56 bg-[radial-gradient(currentColor_2px,transparent_2.5px)] bg-[length:22px_22px]`}
        />
      );
    case 2:
      return (
        <div
          aria-hidden
          className={`${common} -right-4 -bottom-4 size-60 bg-[repeating-linear-gradient(-60deg,currentColor_0_1px,transparent_1px_14px)]`}
        />
      );
    case 3:
      return (
        <svg aria-hidden viewBox="0 0 200 120" className={`${common} right-0 bottom-6 w-[70%]`} fill="none" stroke="currentColor">
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${20 + i * 16} Q 50 ${i * 16} 100 ${20 + i * 16} T 200 ${20 + i * 16}`} strokeWidth="1" />
          ))}
        </svg>
      );
    case 4:
      return (
        <svg aria-hidden viewBox="0 0 200 200" className={`${common} -right-2 -bottom-2 size-56`} fill="none" stroke="currentColor">
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={i * 14} y={i * 14} width={200 - i * 28} height={200 - i * 28} rx="16" strokeWidth="1" />
          ))}
        </svg>
      );
    default:
      return (
        <svg aria-hidden viewBox="0 0 200 200" className={`${common} -right-16 -bottom-16 size-64`} fill="none" stroke="currentColor">
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx="100" cy="100" rx="90" ry="30" transform={`rotate(${i * 15} 100 100)`} strokeWidth="1" />
          ))}
        </svg>
      );
  }
}

export function BrandCard({ brand, index, featured }: { brand: Brand; index: number; featured?: boolean }) {
  const surface = SURFACES[index % SURFACES.length];
  const dark = surface.tone === "dark";

  return (
    <article
      data-brand-card
      className={`group/card relative isolate flex h-full min-h-[300px] flex-col overflow-clip rounded-[28px] p-6 sm:p-8 ${surface.bg} ${
        dark ? "text-ivory" : "text-ink"
      } ${featured ? "lg:min-h-[620px]" : ""}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      {/* pointer spotlight, positioned from CSS vars set by the motion layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${dark ? "rgb(255 255 255 / 0.12)" : "rgb(255 255 255 / 0.5)"}, transparent 60%)`,
        }}
      />
      <Pattern variant={index} />
      <div aria-hidden className={`absolute inset-0 rounded-[inherit] border ${dark ? "border-white/10" : "border-ink/10"}`} />

      <header className="flex items-center justify-between gap-4">
        <span className={`inline-flex size-11 items-center justify-center rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.07]"}`}>
          <PropertyIcon type={brand.propertyType} slug={brand.propertyTypeSlug} />
        </span>
        <p className={`eyebrow text-right !text-[12px] ${dark ? "text-on-dark-muted" : "text-on-light-muted"}`}>
          {[brand.propertyType, brand.city].filter(Boolean).join(" · ")}
        </p>
      </header>

      <h3 className={`mt-auto pt-10 leading-none ${featured ? "text-[clamp(36px,4.4vw,64px)]" : "text-[clamp(28px,3vw,40px)]"}`}>
        <Wordmark brand={brand} index={index} className="!whitespace-normal" />
      </h3>

      <div
        className={`mt-6 flex flex-col gap-4 border-t pt-5 ${dark ? "border-white/15" : "border-ink/15"} ${featured ? "lg:flex-row lg:items-end lg:justify-between" : ""}`}
      >
        <p className="flex items-baseline gap-2">
          <CountUp value={brand.openRoles} className="font-mono text-[32px] leading-none font-medium tracking-tight" />
          <span className={`text-[14px] ${dark ? "text-on-dark-muted" : "text-on-light-muted"}`}>open roles</span>
        </p>
        {brand.quote && (
          <blockquote className={`display max-w-[34ch] text-[20px] leading-[1.3] italic ${dark ? "text-ivory/85" : "text-ink/80"}`}>
            &ldquo;{brand.quote}&rdquo;
          </blockquote>
        )}
      </div>
    </article>
  );
}
