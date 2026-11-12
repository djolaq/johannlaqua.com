# AGENTS.md — johannlaqua.com

Architecture reference for any AI agent (Claude Code, Codex, etc.) working on this repo. To be kept up to date on every structural change (new stack, new directory, convention change). The `README.md` is the user/contributor documentation in English; this file is the *agent* doc, denser and decision-oriented.

## Overview

Static personal website for Johann Laqua (Senior Developer · AI-Boosted · Cybersecurity Red & Blue Team). Bilingual FR/EN, zero client-side JS by default, built with Astro in `output: 'static'` mode.

- **Repo** : `djolaq/johannlaqua.com`
- **Target domain** : `https://johannlaqua.com` (see `site` in `apps/site/astro.config.mjs`)
- **Contact/git identity** : johann@laqua.fr

## Stack

| Area | Choice | Why |
|---|---|---|
| Framework | Astro 7 (`apps/site/astro.config.mjs`) | Static by default, reusable components, no imposed JS runtime |
| i18n | Native Astro i18n (`i18n.defaultLocale: 'fr'`, `locales: ['fr','en']`, `prefixDefaultLocale: false`) | FR at the root `/`, EN under `/en/` |
| Blog content | Content Layer API (`apps/site/src/content.config.ts`, `glob` loader) — **not** the legacy Content Collections API | Required with Astro 7 |
| CSS | Native CSS + custom properties, no framework, from `@johannlaqua/design-system` | Minimal bundle, a single token file as source of truth |
| Sitemap | `@astrojs/sitemap` | SEO |
| Unit tests | Vitest (`apps/site/vitest.config.ts`) | Pure logic only (i18n utils) |
| e2e tests | Playwright (`apps/site/playwright.config.ts`) | Real served pages (build + `astro preview`) |
| Repo layout | npm workspaces: `apps/site`, `packages/design-system` | One repo, one lockfile, clear boundaries (ADR 0001) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | `npm run check` + unit + e2e tests on every PR/branch push, Node read from `.nvmrc` (22.x) required by Astro 7 |
| Deployment | GitHub Actions (`.github/workflows/deploy.yml`) + `deploy/` | Test → build artifact → host job chosen by the `DEPLOY_TARGET` repo variable; host not chosen yet (ADR 0003) |
| TypeScript | `astro/tsconfigs/strict` | Strict by default |
| npm environment | `.npmrc` + `.nvmrc` + `engines`/`packageManager` in `package.json`, **exact** versions (no `^`) | Reproducible installs (`npm ci`), engine-strict, systematic audit |

Node.js 22.12+ required (Astro 7). Version managed by `.nvmrc`; every build/CI chain must read it from this file rather than duplicating it.

## Directory tree

Monorepo with npm workspaces (`apps/*`, `packages/*`). Overview and rationale: `docs/architecture.md`, `docs/adr/`.

```
package.json               workspaces + root scripts (dev, build, check, test, design:build) — run everything from the root
.npmrc / .nvmrc            npm policy and Node version, shared by all workspaces
apps/
  site/                    @johannlaqua/site — the Astro website, the only deployable
    astro.config.mjs        i18n routing, sitemap, output static
    src/
      components/            UI components (.astro), one file per component, no heavy business logic
        Section.astro         section wrapper (rhythm, optional tone, anchor id) — use for every page section
        AnnouncementBar.astro blue strip above the header linking to the latest post
        MethodChart.astro     hero glass card with the illustrative method chart (no data)
        LegalArticle.astro    prose wrapper (eyebrow, title, last-updated date) shared by the legal pages
      layouts/
        BaseLayout.astro      <head>, Header, Footer, i18n/SEO meta — root layout of every page
        BlogPostLayout.astro  layout specific to posts (on top of BaseLayout)
      config/
        site.ts               contact email + social profiles (GitHub, LinkedIn) — SINGLE SOURCE, imported by Footer, ContactCTA and BaseLayout's JSON-LD
        security.ts           Content-Security-Policy of the <meta> fallback (mirror it in deploy/headers/)
      data/
        legal.ts              publisher + host details for the legal pages — SINGLE SOURCE, imported by the legal notice/privacy pages
        projects.ts           public repos shown in the home "Lab" section (name, URL, stack, i18n description key) — SINGLE SOURCE
      i18n/
        ui.ts                 FR/EN translation dictionary — SINGLE SOURCE of UI strings, UiKey type derived from FR keys
        utils.ts               getLangFromUrl, useTranslations(locale), localizePath, getAlternateLocalePath
      content/
        blog/fr/*.md           FR posts
        blog/en/*.md            EN posts
      content.config.ts        Zod schema of the "blog" collection (see below)
      pages/
        index.astro             FR home (root, default locale)
        blog/index.astro         FR post list
        blog/[slug].astro        FR post
        en/index.astro           EN home
        en/blog/index.astro      EN post list
        en/blog/[slug].astro      EN post
        mentions-legales.astro    FR legal notice (EN: en/legal-notice.astro)
        confidentialite.astro     FR privacy policy (EN: en/privacy.astro)
    public/                    favicon.svg, robots.txt, .well-known/security.txt (static assets served as-is)
    tests/
      unit/                    Vitest — pure logic only
      e2e/                     Playwright — real pages (home, language switching, security: zero external requests, CSP, security.txt)
packages/
  design-system/           @johannlaqua/design-system — imported by the site, depends on nothing here
    README.md               design reference (palette, tones, type scale, rules, changelog)
    src/tokens.css          design tokens (custom properties) — VISUAL SOURCE OF TRUTH
    src/global.css          reset, tones (.tone-charcoal/.tone-sand), .card, .kicker, .accent, .guides, .prose, .link
    src/fonts.css           @fontsource imports (Geist, Instrument Serif, JetBrains Mono)
    src/index.css           fonts + global — what the site imports
    src/network-field.js    geometry of the hero visual (shared by NetworkField.astro and the SVG export)
    tokens/tokens.json      GENERATED from tokens.css (`npm run design:build`)
    assets/                 network-field.svg (GENERATED), mark.svg, favicon.svg
    specimen/index.html     visual reference page, opens from disk
    references/             inspiration image and notes
deploy/                    host-specific scripts + deployment guide (README.md)
  headers/                 security headers per host (apache.htaccess, _headers)
docs/
  architecture.md          the split, the dependency direction, where a change goes
  adr/                     architecture decision records
.github/workflows/
  ci.yml                   check + unit + e2e (PRs, branches, and called by deploy.yml)
  deploy.yml               test → build (artifact) → deploy job selected by the DEPLOY_TARGET variable
  dependabot.yml           weekly npm + github-actions updates
.claude/skills/            project skills for Claude Code agents (see below)
```

Rules: dependencies go design-system → site → deploy, never back. The site defines no colour/size of its own. `deploy/` only sees the built `dist/`.

## Conventions

### i18n
- Every user-facing string goes through `apps/site/src/i18n/ui.ts` + `useTranslations()`. Never hardcode visible text in an `.astro` component.
- The `ui.fr` and `ui.en` objects must have **exactly the same keys** (`UiKey` is derived from `ui.fr` — a mismatch breaks typing or silently falls back to FR via the `useTranslations` fallback).
- FR is the default locale and lives at the root (`/`), no `/fr/` prefix. EN lives under `/en/`. Any new route must be duplicated in both trees of `apps/site/src/pages/` (`pages/x.astro` and `pages/en/x.astro`).

### Blog content
- One post = two Markdown files, one per language, linked by the `translationId` field (same value on both sides) defined in `content.config.ts`. That is what lets the language switch find the translated post.
- Schema (`apps/site/src/content.config.ts`) : `title`, `description`, `date` (coercible), `tags: string[]` (default `[]`), `draft: boolean` (default `false`), `translationId: string` (required).
- FR and EN slugs can differ (the slug comes from the filename via the `glob` loader) — `translationId`, not the slug, links the two versions.

### Design system
- Lives in `packages/design-system` (see ADR 0002). Full reference: **`packages/design-system/README.md`** (palette, tones, type scale, layout, signature elements, rules, changelog). Values: `packages/design-system/src/tokens.css`. After changing tokens or the hero geometry run `npm run design:build` (CI fails if `tokens.json` / `network-field.svg` are stale).
- Palette: Charcoal `#1E1E1C` (ink, dark bands), Sand `#D8CBB3` (paper, the page), Electric blue `#2F6BFF` (actions, links, graph strokes, focus — never small text: use `--blue-300` on charcoal, `--blue-700` on sand).
- Components use **semantic tokens** (`--surface`, `--surface-card`, `--text`, `--text-muted`, `--rule`, `--link`, `--accent-stroke`…), redefined by the tone classes `.tone-charcoal` (default, on `<body>`) and `.tone-sand` in `global.css`. Never raw hex in a component.
- Fonts: Geist (everything by default), Instrument Serif (italic headline endings `.accent`, quotes), JetBrains Mono (code, dates) — self-hosted via `@fontsource*` (dependencies of the design-system package, loaded by its `fonts.css`); `BaseLayout.astro` only does `import '@johannlaqua/design-system'`. No external font CDN (privacy policy promises no third-party requests).
- Layout: sections go through `Section.astro` + `SectionHeading.astro` (kicker, title, italic accent); content in glass `.card`s. Hero = generated network map (`NetworkField.astro`, no photo) + `MethodChart.astro` glass card; `AnnouncementBar.astro` links the latest post.

### Positioning
- The site showcases skills and demonstrates them (Skills + Lab sections, blog); it does **not** sell services. No "hire me" / "available for missions" / pricing copy. Claims should be backed by something visible (a public repo, a post, this site itself).

### Security & privacy
- **No third-party resource, ever**: no CDN, font service, analytics, tracking pixel, iframe or remote image. The privacy policy promises it and `tests/e2e/security.spec.ts` enforces it on every page of the sitemap.
- **CSP**: `src/config/security.ts` (meta fallback) and `deploy/headers/*` (host headers) carry the same policy. It denies scripts and inline styles, so never add inline `<style>`/`style=""`, `<script>` or `data:` fonts; `astro.config.mjs` disables CSS and asset inlining for that reason. A real need for client JS means a deliberate CSP change in both places.
- **If an embed ever becomes unavoidable**: it must be click-to-load (nothing contacts the third party before the visitor opts in), carry `sandbox` with the minimum tokens, `referrerpolicy="no-referrer"` and `loading="lazy"`, be allowed by origin in the CSP (never a wildcard), and the privacy policy must be updated first. Outgoing links to other sites use `rel="noopener noreferrer"`.
- **Supply chain**: every `uses:` in `.github/workflows/` is pinned to a full commit SHA with the version in a comment (Dependabot keeps both current); CI runs `npm audit --audit-level=high`.
- `public/.well-known/security.txt`: renew `Expires` (≤ 1 year ahead) when the e2e test warns, 30 days before it lapses.

### Language
- Everything about the project is written in **English**: docs, ADRs, skills, code comments, commit messages, PRs, design-system pages. The only French in the repo is the site's own French content (default locale): `ui.fr`, `content/blog/fr/`, the FR legal pages and the tests that assert on them.

### Code style
- Astro components: one component = one `.astro` file, typed props, no heavy business logic (keep it in `i18n/utils.ts` or equivalent).
- Identity/SEO: social profile links carry `rel="me noopener noreferrer"` (IndieWeb/Mastodon identity verification) and `BaseLayout` emits a JSON-LD `Person` whose `sameAs` is derived from `apps/site/src/config/site.ts`. Any new profile is added in `site.ts` only.
- Zero client JS by default: only add JS (`<script>` in an `.astro`) for a real interactive need (e.g. `LanguageToggle`), never by default.

## Tests & CI

```bash
# all from the repo root
npm run check      # astro check (site) + generated-file check (design system)
npm run test:unit  # Vitest — apps/site/tests/unit/
npm run test:e2e   # build + astro preview + Playwright — apps/site/tests/e2e/
npm test           # both
```

CI (`.github/workflows/ci.yml`) runs `npm audit --audit-level=high` → `check` → `test:unit` → Playwright browser install → `test:e2e` on every PR and branch push, Node 22. The Playwright report is uploaded only on failure. On `main`, `deploy.yml` calls the same workflow before building and deploying.

Before proposing a change as done: run `npm run check` and the relevant tests. Any new route or interactive component deserves an e2e test; any new pure function in `i18n/utils.ts` deserves a unit test.

## Project skills

See `.claude/skills/`:
- `new-blog-post` — scaffolds an FR+EN post with coherent frontmatter and `translationId`.
- `add-i18n-string` — adds a translation key while keeping `ui.fr`/`ui.en` in sync.
- `sync-design-tokens` — checks `packages/design-system/src/tokens.css` consistency as the design system source of truth.
- `astro` — official Astro guide (astrolicious/agent-skills): SSG, components, content collections, CLI, deployment. Consult for any structural Astro decision.
- `publishing-astro-websites` — comprehensive Astro guide (SpillwaveSolutions): Content Layer API, Markdown/MDX, i18n, patterns (pagination, tags, RSS), perf, Vitest/Playwright tests, deployment.
- `astro-framework` — Astro 5+/6+ specialist (delineas/astro-framework-agents) with `references/` and `rules/`: islands, hydration, loaders, i18n routing, view transitions.

## Known todos / debt

- No known debt at the moment.

## Maintaining this file

This file must be updated on every structural change: new major dependency, new workspace or directory under `apps/site/src/`, i18n/content/design convention change, CI pipeline change. Do not duplicate what is already authoritative elsewhere (e.g. the exact npm scripts list lives in `package.json`) — point to the source instead of copying it when it changes often.