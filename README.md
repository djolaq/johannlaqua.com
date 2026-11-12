# johannlaqua.com

Personal website of Johann Laqua — senior developer, AI-assisted development and cybersecurity (red & blue team).

100% static site, built with [Astro](https://astro.build), bilingual FR/EN, no client-side JavaScript by default.

## Stack

- **Astro** — static generation, zero JS by default
- **Content Collections** (Content Layer API) for the blog/journal posts (Markdown)
- **Native CSS** with design tokens (custom properties) — no CSS framework, to keep the bundle minimal
- **Native Astro i18n** — FR at the root (`/`), EN under `/en/`

## Repository layout

```
apps/site/                the Astro website (the only deployable)
packages/design-system/   tokens, base styles, fonts, visuals, specimen page
deploy/                   deployment scripts and guide
docs/                     architecture and decision records
.github/workflows/        ci.yml (tests) · deploy.yml (test → build → deploy)
```

npm workspaces, one lockfile. Why it is split this way: [`docs/architecture.md`](docs/architecture.md).

## Local development

Prerequisites: Node.js 22.12+ (required by Astro 7). Run everything from the repo root.

```bash
npm install
npm run dev
```

The site is served at http://localhost:4321. Pages reload automatically.

## Other commands

```bash
npm run check         # type checking + design-system generated files
npm run build         # production static build into apps/site/dist/
npm run preview       # serves the production build locally for final checks
npm run design:build  # regenerates tokens.json and the exported hero SVG
```

## Tests

- **Unit** ([Vitest](https://vitest.dev)) — pure i18n logic in `apps/site/tests/unit/`.
- **Integration / e2e** ([Playwright](https://playwright.dev)) — real served pages (build + `astro preview`) in `apps/site/tests/e2e/`: navigation, home page content, FR/EN language switching, legal pages, and an accessibility suite (`a11y.spec.ts`: axe-core WCAG 2.2 AA scan of every page type in both locales, 24px target size, keyboard focus, reflow at 320px and 200% zoom, `prefers-contrast` / `prefers-reduced-motion`).

```bash
npm run test:unit   # unit tests
npm run test:e2e    # build + e2e tests (install browsers first: npx playwright install --with-deps chromium)
npm test            # both
E2E_PORT=4400 npm run test:e2e   # e2e on another port (4321 is the default)
```

These tests run on every PR and branch push via GitHub Actions (`.github/workflows/ci.yml`), and again on `main` before any deployment.

## Design system

Charcoal `#1E1E1C`, Sand `#D8CBB3` and Electric blue `#2F6BFF`, set in
Geist, Instrument Serif and JetBrains Mono (self-hosted).
It lives in [`packages/design-system`](packages/design-system/README.md): the
values in `src/tokens.css`, the reference in its README, and a specimen page
(`specimen/index.html`, opens from disk after `npm install`).

## Content to customize

- `apps/site/src/i18n/ui.ts` — all site copy (bio, skills, lab, etc.)
- `apps/site/src/data/projects.ts` — public projects shown in the Lab section
- `apps/site/src/content/blog/` — journal posts
- `apps/site/src/config/site.ts` — contact email and GitHub/LinkedIn profiles

## Deployment

The site builds into pure static files, deployable on any static host.
`.github/workflows/deploy.yml` tests, builds and publishes on every push to
`main`; the host is selected with the `DEPLOY_TARGET` repository variable and
is **not chosen yet** (until then the workflow only builds). See
[`deploy/README.md`](deploy/README.md).
