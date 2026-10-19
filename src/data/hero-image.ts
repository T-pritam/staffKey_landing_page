/**
 * The page's one photograph. Swap the files in public/hero/ (or point src at
 * an Unsplash URL allowed in next.config.ts) and update the sizes below.
 */
export type HeroImage = {
  src: string;
  width: number;
  height: number;
  /** Portrait crop for phones. Falls back to `src` when absent. */
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
  alt: string;
  /** CSS object-position, so the subject stays in frame at every ratio. */
  focalPoint: { desktop: string; mobile: string };
  caption: string;
  /** Tiny inline image shown while the real one loads. */
  blurDataURL: string;
  mobileBlurDataURL?: string;
};

export const heroImage: HeroImage = {
  src: "/hero/hero.webp",
  width: 2560,
  height: 1429,
  mobileSrc: "/hero/hero-mobile.webp",
  mobileWidth: 1429,
  mobileHeight: 2560,
  alt: "A chef in whites plating a dish at the pass under copper heat lamps, his brigade working behind him.",
  focalPoint: { desktop: "72% 40%", mobile: "60% 55%" },
  caption: "The pass, 9:40 pm. Dinner service.",
  blurDataURL:
    "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAABQBACdASoYAA0APu1kqU2ppaQiMAgBMB2JYgC7AYw8slDoarr22PC1nwgAAP7+FPNB3hpVlHTyZjuQzqXiLxA/O94U24/PvifmUOh3biGRLHB5EWmWZ6r8i+7YZB/ppjc0u8A3Ir2jHCGC9KIGTcDbZFOsx2YQExBnGVoHQcc009VcZtlDqe4cYFrz4PiV/jnLdszWKK4AAA==",
  mobileBlurDataURL:
    "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAQBACdASoNABgALrV2u12jqampiYC0SgCsIHAguS/0uk7dpFlLH/PcAAD++EphBZRnIxZ/w+YLWcDyPOhRoODR6k3TE2scxTxr+uUZuimv5ASVTb4TFlKRU+zjqLaHoNcx0ryCESHpFunlG0M0AckLmb49S0grSGTQzwu4CJu1bEH0t5GGHFK+/+JbjQSgeLOwUSxYX6AAAA==",
};
