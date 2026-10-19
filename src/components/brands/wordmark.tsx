import type { Brand } from "@/lib/types";

/**
 * Fictional brands have no logo files, so each gets a typographic wordmark.
 * The style is picked from the brand's position, so a real logo (`logoSrc`)
 * can replace it later without touching the layout.
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

export function Wordmark({ brand, index, className }: { brand: Brand; index: number; className?: string }) {
  if (brand.logoSrc) {
    // eslint-disable-next-line @next/next/no-img-element -- partner logos are small SVGs; no optimisation needed
    return <img src={brand.logoSrc} alt={brand.name} className={`h-[1em] w-auto ${className ?? ""}`} />;
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
