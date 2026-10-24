import type { Mark } from "@/lib/types";

/**
 * A brand without a logo file gets a typographic wordmark, styled by its
 * position. An admin-uploaded logo (`logoSrc`, a transparent PNG or WebP)
 * replaces it at the same size, so the layout never changes.
 */
const STYLES = [
  "font-display italic tracking-[-0.02em]",
  "font-sans font-semibold uppercase tracking-[0.2em] text-[0.62em]",
  "font-display tracking-[-0.01em]",
  "font-mono uppercase tracking-[-0.04em] text-[0.7em] font-medium",
  "font-sans font-bold lowercase tracking-[-0.055em]",
  "font-display italic tracking-[-0.03em]",
  "font-sans font-light uppercase tracking-[0.32em] text-[0.56em]",
  "font-display uppercase tracking-[0.04em] text-[0.82em]",
] as const;

export function Wordmark({ brand, index, className }: { brand: Mark; index: number; className?: string }) {
  if (brand.logoSrc) {
    // eslint-disable-next-line @next/next/no-img-element -- small admin-uploaded logos, already sized; no optimisation needed
    return <img src={brand.logoSrc} alt={brand.name} loading="lazy" decoding="async" className={`h-[1em] w-auto max-w-[6em] object-contain ${className ?? ""}`} />;
  }
  const style = STYLES[index % STYLES.length];
  const amp = brand.name.split(/(&)/);
  return (
    <span className={`inline-block leading-none whitespace-nowrap ${style} ${className ?? ""}`}>
      {amp.map((part, i) =>
        part === "&" ? (
          <span key={i} className="font-display text-champagne italic">
            &amp;
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
