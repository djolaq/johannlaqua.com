# johannlaqua.com

Personal website of Johann Laqua — senior developer, AI-assisted development and cybersecurity (red & blue team).

100% static site, built with [Astro](https://astro.build), bilingual FR/EN, no client-side JavaScript by default.

## Stack

- **Astro** — static generation, zero JS by default
- **Content Collections** (Content Layer API) for the blog/journal posts (Markdown)
- **Native CSS** with design tokens (custom properties) — no CSS framework, to keep the bundle minimal
- **Native Astro i18n** — FR at the root (`/`), EN under `/en/`

## Local development

Prerequisites: Node.js 22.12+ (required by Astro 7).

```bash
npm install
npm run dev
```

The site is served at http://localhost:4321. Pages reload automatically.

## Other commands

```bash
npm run check    # TypeScript / Astro type checking
npm run build    # production static build into dist/
npm run preview  # serves the production build locally for final checks
```

## Tests

- **Unit** ([Vitest](https://vitest.dev)) — pure i18n logic (`src/i18n/utils.ts`) in `tests/unit/`.
- **Integration / e2e** ([Playwright](https://playwright.dev)) — real served pages (build + `astro preview`) in `tests/e2e/` : navigation, home page content, FR/EN language switching (including on a blog post, whose slug differs per language).

```bash
npm run test:unit   # unit tests
npm run test:e2e    # build + e2e tests (install browsers first: npx playwright install --with-deps chromium)
npm test            # both
```

These tests run automatically on every push/PR via GitHub Actions (`.github/workflows/ci.yml`).

## Project structure

```
src/
  components/        reusable UI components (Hero, Services, BlogCard, ...)
  layouts/            BaseLayout (head, header, footer) and BlogPostLayout
  i18n/                FR/EN translation dictionary and routing helpers
  content/blog/fr|en/  journal posts, one Markdown file per post and language
  content.config.ts   "blog" collection schema
  pages/               fr at the root, en under /en/
  styles/              tokens.css (design system) + global.css (reset and base styles)
public/                favicon, robots.txt
tests/
  unit/                Vitest tests (pure logic)
  e2e/                 Playwright tests (real pages)
```

## Design system

The visual tokens (colors, typography, spacing, radii, shadows) live in
`src/styles/tokens.css`. It is the source of truth: any change made in a
Claude Design canvas must be mirrored here (and vice-versa) to stay in sync with the code.

## Content to customize

- `src/i18n/ui.ts` — all site copy (bio, services, etc.)
- `src/content/blog/` — journal posts
- `src/config/site.ts` — contact email and GitHub/LinkedIn profiles (used by the footer and the contact section)

## Deployment

The site builds into pure static files (`npm run build` → `dist/`), deployable on
any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.).