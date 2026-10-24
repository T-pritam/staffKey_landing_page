# Staffkey landing page

The public marketing page for Staffkey: hospitality hiring for Indian hotels and restaurants.

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, Flip) with Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

Environment variables:

| Variable | What it does | Default |
|---|---|---|
| `STAFFKEY_APP_URL` | Origin of the Staffkey app. The page's content is read from it, and its buttons point into it. | `https://staging.staffkey.in` |
| `LANDING_REVALIDATE_SECRET` | Shared secret for `POST /api/revalidate`. Must equal the app's `LANDING_REVALIDATE_SECRET`. Unset, the endpoint refuses every call and the page only refreshes on its five-minute timer. | unset |
| `NEXT_PUBLIC_SITE_URL` | This site's public URL, used for Open Graph links. | `http://localhost:3000` |

## Content (edited in the Staffkey admin)

Everything except the hero photo and the fixed copy is edited by a Staffkey admin under **/admin/landing** in the app, and read from `GET {STAFFKEY_APP_URL}/api/v1/public/landing`:

| On the page | Admin tab |
|---|---|
| Hero counters (verified candidates, partner properties, cities, available now) | Hero numbers & links |
| Where every button goes (employer login, employer sign-up, candidate web, app download) | Hero numbers & links |
| Scrolling "Trusted by" logos (transparent PNG/WebP, or the name as a wordmark) | Trusted-by logos |
| Property cards (name, type, city, description, openings, logo) | Property cards |
| Job cards (sample listings, labelled as samples) | Sample jobs |

Only published entries appear. With no sample jobs published the jobs section shows its empty state; with no logos or cards those parts are left out.

**How fast a change shows.** `src/lib/data.ts` caches the content under the tag `landing` and refreshes it every five minutes on its own. Each admin save also calls `POST /api/revalidate` here, which expires the cache, so the next visitor sees the change, normally within seconds. If that call fails, the five-minute refresh still picks the change up. If the API cannot be reached at all, the page renders with default counters, links to the app's own pages and empty sections.

The response shape is in `src/lib/types.ts`, mirroring `lib/landing-content/shared.ts` in the staffkey repo. That file is the contract.

**Phones.** Candidate buttons (Find a job, Apply, Apply in two minutes, the candidate card) open the Play Store on Android or the App Store on iOS when those links are set, then the download page, and candidate web otherwise. Desktop always opens candidate web. Today no store or download link is set, so every device goes to candidate web.

### The hero photo

Edit `src/data/hero-image.ts`. It holds the desktop `src`, the portrait `mobileSrc` used on phones, their pixel sizes, `alt` text, the focal point for each crop, the caption and the tiny blur placeholders.

- Put the files in `public/hero/`, or use an `images.unsplash.com` URL (already allowed in `next.config.ts`; add other hosts to `remotePatterns`).
- Keep the long edge about 2560px and the file under about 300 KB. Next.js serves AVIF/WebP at the right size for each screen.
- The blur placeholder is a 24px WebP as a base64 data URL. Any tiny image works.

### Links into the app

`src/lib/links.ts` holds the fallbacks used when the content cannot be fetched, the fixed pages (privacy, terms) and the in-page section ids (`#brands`, `#live-jobs`, `#for-employers`).

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
