# 0004 — One request per page: inlined CSS, self-hosted fonts, no prefetch

Date: 2026-11-12 · Status: accepted

## Context

The site already shipped 0 KB of client JS and small pages, but first paint
waited on two render-blocking stylesheets, fonts were plain `@fontsource` CSS
imports (no preload, no fallback metrics, so a layout shift when they swap
in), and the build carried every subset and legacy `.woff` file (286 KB of
fonts on disk for ~92 KB actually used). Audit lot E (issue #28).

## Decision

- **Fonts** go through the Astro Fonts API with the `local` provider. The
  design system declares the families in `packages/design-system/src/fonts.js`,
  pointing at the latin woff2 files of its pinned `@fontsource` packages;
  `astro.config.mjs` passes them to `fonts`, `BaseLayout` renders `<Font>`.
  Astro hashes the files, inlines the `@font-face` rules and generates
  metric-matched fallbacks. Geist and the italic serif (the hero headline)
  are preloaded; mono is not.
  - Not `fontProviders.fontsource()` nor `npm()`: both fetch the files from a
    CDN at build time. `local` reads `node_modules`, so the build is offline
    and the versions are the ones in the lockfile.
- **CSS** is inlined in every page (`build.inlineStylesheets: 'always'`).
  Measured on the home page (gzip): `auto` = 8.8 KB of HTML + 2 blocking
  requests (3.4 + 2.5 KB, both above the 4 KB inline limit); `always` =
  13.5 KB in one response, no blocking request. It fits in the first TCP
  round trip (~14 KB), so it is one round trip fewer for every first visit.
- **No prefetch** (`prefetch` stays off). It needs Astro's client script,
  which breaks the zero-JS promise, for little gain: a navigation is already
  a single ~6 KB request once the fonts are cached.
- **A size budget** (`apps/site/scripts/size-budget.mjs`, run in CI) fails the
  build on: a page above 16 KB gzip, any client JS, any render-blocking
  stylesheet, more than 128 KB of fonts, any non-woff2 font file.

## Why

- No request blocks the first paint but the HTML itself; with fallback
  metrics, font swaps do not move the layout.
- The fonts on disk drop from 286 KB (18 files) to 110 KB (4 files).
- The budget turns these properties into something CI defends, instead of a
  claim in a README.

## Cost

- CSS is no longer cached across pages: each page carries its ~3 KB gzip of
  styles again. Cheaper than a blocking request at this size; revisit if
  the stylesheet grows past the budget.
- Glyphs outside the latin subset (e.g. Polish, Vietnamese, Cyrillic) render
  in the fallback font. Add a subset in `fonts.js` if content needs one.
- Raising a budget is a deliberate change in the script, reviewed in the PR
  that needs it.
