import { useId } from "react";

import { LOGO_HEIGHT, LOGO_SILHOUETTE, LOGO_UNDERLINE, LOGO_UNDERLINE_Y, LOGO_VIEWBOX, LOGO_WIDTH } from "./paths";

type Tone = "white" | "black" | "mono";

const WORD: Record<Tone, string> = {
  white: "#FFFFFF",
  black: "#07080B",
  mono: "currentColor",
};

/**
 * The Staffkey wordmark as inline SVG. White and black keep the blue
 * underline (the "y" tail fades from the wordmark colour into it, as in the
 * original); mono is a single colour that follows `currentColor`.
 */
export function Logo({
  tone = "white",
  className,
  title = "Staffkey",
}: {
  tone?: Tone;
  className?: string;
  title?: string | null;
}) {
  const gradientId = useId();
  const word = WORD[tone];
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {tone !== "mono" && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1={LOGO_UNDERLINE_Y[0]}
            x2="0"
            y2={LOGO_UNDERLINE_Y[1]}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={word} />
            <stop offset="0.62" stopColor="#123FF0" />
          </linearGradient>
        </defs>
      )}
      <path fill={word} fillRule="evenodd" d={LOGO_SILHOUETTE} />
      {tone !== "mono" && <path fill={`url(#${gradientId})`} d={LOGO_UNDERLINE} />}
    </svg>
  );
}
