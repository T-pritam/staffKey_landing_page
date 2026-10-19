# Staffkey landing page

The public marketing page for Staffkey: hospitality hiring for Indian hotels and restaurants.

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, Flip) with Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

Optional environment variables:

| Variable | What it does | Default |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Origin of the Staffkey app. Sign-in, sign-up and Apply links point here. | `""` (same origin) |
| `NEXT_PUBLIC_SITE_URL` | This site's public URL, used for Open Graph links. | `http://localhost:3000` |

## Swap in real content

### The hero photo

Edit `src/data/hero-image.ts`. It holds the desktop `src`, the portrait `mobileSrc` used on phones, their pixel sizes, `alt` text, the focal point for each crop, the caption and the tiny blur placeholders.

- Put the files in `public/hero/`, or use an `images.unsplash.com` URL (already allowed in `next.config.ts`; add other hosts to `remotePatterns`).
- Keep the long edge about 2560px and the file under about 300 KB. Next.js serves AVIF/WebP at the right size for each screen.
- The blur placeholder is a 24px WebP as a base64 data URL. Any tiny image works.

### Jobs and brands (the API swap)

All page data comes from `src/lib/data.ts`:

```ts
getJobs():      Promise<Job[]>    // sample data now; later GET /public/live-jobs
getBrands():    Promise<Brand[]>  // sample data now; later GET /public/brands
getLiveStats(): Promise<LiveStats> // hero numbers
```

Replace each function body with a `fetch` to the Staffkey API and keep the return type. Nothing else needs to change: components take the data as props, the brands and jobs sections already have skeleton loaders (React Suspense) and an empty state.

The `Job` type mirrors the app's `LiveJob` (`lib/live-jobs/shared.ts`) plus display fields (`title`, `department`, `employmentType`, `salary`). Sample rows live in `src/data/jobs.ts` and `src/data/brands.ts`.

Brands are **fictional** on purpose. Real hotel names and logos need written permission. When you have them, set `logoSrc` on a brand and the logo replaces its typographic wordmark.

### Links into the app

`src/lib/links.ts`. Apply uses the same shape as the app's `signupPathFor()`: `/login/candidate?apply=<vacancyId>`.

## Brand assets

`public/brand/`:

- `staffkey-black.svg`, `staffkey-white.svg`: the wordmark with the blue underline (traced from `staffkey-logo.png`)
- `staffkey-mono.svg`: single colour, follows `currentColor`
- `staffkey-icon.svg`: the "k" with its dot, used as the favicon (`src/app/icon.svg`)
- `staffkey-logo.png`: the original

In React, use `<Logo tone="white" | "black" | "mono" />` from `src/components/logo/logo.tsx`.

## How it's built

```
src/
  app/            layout (fonts, metadata), page, icon, Open Graph image
  components/
    header/       floating pill header + full-screen mobile menu
    hero/         photo, headline, role ticker, stats; hero-motion.tsx adds GSAP
    brands/       marquee, bento cards, typographic wordmarks
    jobs/         filter chips (GSAP Flip), job rows, CTA band
    footer/       footer + the outlined wordmark that fills on scroll
    logo/         inline SVG logo and its traced paths
    motion/       Lenis + scroll progress line
    ui/           split-words, scroll-words, count-up, magnetic
  data/           hero image, sample jobs and brands
  lib/            data.ts, motion.ts, types, formatting, links
```

### Motion

`src/lib/motion.ts` is the single motion system: plugin registration, the Lenis instance on GSAP's ticker, shared eases, durations and staggers, media queries, and `onIdle()`.

- The **hero entrance** (desktop curtain reveal, photo settle, word rise, fades) is plain CSS (`.hero-*` in `globals.css`), so it starts at first paint and always ends visible, even without JavaScript.
- Everything after load uses GSAP: ambient Ken Burns and light blooms, mouse parallax, the hero pin and hand-off, header hide/show, marquee speed, card and row reveals, count-ups, the Flip filter and the footer fill.
- Below-the-fold setup waits for `onIdle()`, so it doesn't compete with first load. Flip is loaded the first time someone filters.
- `prefers-reduced-motion` turns off pinning, parallax, autoplay and velocity effects and keeps simple fades. Phones get lighter versions: no pin, no parallax, no magnetic buttons, and no clip-path curtain.

### Performance notes

- The hero is rendered outside Suspense, so it is in the first HTML paint.
- Brands, jobs and the footer use `content-visibility: auto` (`.defer-render`) so off-screen sections skip layout until needed. In-page links re-check their target after scrolling, because those sections can change size as they render.
- The hero photo is preloaded per crop (`media` queries) with `fetchPriority="high"`.
- Geist Mono is `display: optional` and not preloaded; it's only used for labels.
