# AGENTS.md — johannlaqua.com

Architecture reference for any AI agent (Claude Code, Codex, etc.) working on this repo. To be kept up to date on every structural change (new stack, new directory, convention change). The `README.md` is the user/contributor documentation in English; this file is the *agent* doc, denser and decision-oriented.

## Overview

Static personal website for Johann Laqua (Senior Developer · AI-Boosted · Cybersecurity Red & Blue Team). Bilingual FR/EN, zero client-side JS by default, built with Astro in `output: 'static'` mode.

- **Repo** : `djolaq/johannlaqua.com`
- **Target domain** : `https://johannlaqua.com` (see `site` in `astro.config.mjs`)
- **Contact/git identity** : johann@laqua.fr

## Stack

| Area | Choice | Why |
|---|---|---|
| Framework | Astro 7 (`astro.config.mjs`) | Static by default, reusable components, no imposed JS runtime |
| i18n | Native Astro i18n (`i18n.defaultLocale: 'fr'`, `locales: ['fr','en']`, `prefixDefaultLocale: false`) | FR at the root `/`, EN under `/en/` |
| Blog content | Content Layer API (`src/content.config.ts`, `glob` loader) — **not** the legacy Content Collections API | Required with Astro 7 |
| CSS | Native CSS + custom properties, no framework | Minimal bundle, a single token file as source of truth |
| Sitemap | `@astrojs/sitemap` | SEO |
| Unit tests | Vitest (`vitest.config.ts`) | Pure logic only (i18n utils) |
| e2e tests | Playwright (`playwright.config.ts`) | Real served pages (build + `astro preview`) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | `npm run check` + unit + e2e tests on every push/PR, Node 22 required by Astro 7 |
| TypeScript | `astro/tsconfigs/strict` | Strict by default |

Node.js 22.12+ required (Astro 7).

## Directory tree

```
astro.config.mjs        i18n routing, sitemap, output static
src/
  components/            UI components (.astro), one file per component, no heavy business logic
  layouts/
    BaseLayout.astro      <head>, Header, Footer, i18n/SEO meta — root layout of every page
    BlogPostLayout.astro  layout specific to posts (on top of BaseLayout)
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
  styles/
    tokens.css              design tokens (custom properties) — VISUAL SOURCE OF TRUTH
    global.css               reset + base styles
public/                    favicon.svg, robots.txt (static assets served as-is)
tests/
  unit/                    Vitest — pure logic only
  e2e/                     Playwright — real pages (home, language switching)
.github/workflows/ci.yml   CI pipeline
.claude/skills/            project skills for Claude Code agents (see below)
```

## Conventions

### i18n
- Every user-facing string goes through `src/i18n/ui.ts` + `useTranslations()`. Never hardcode visible text in an `.astro` component.
- The `ui.fr` and `ui.en` objects must have **exactly the same keys** (`UiKey` is derived from `ui.fr` — a mismatch breaks typing or silently falls back to FR via the `useTranslations` fallback).
- FR is the default locale and lives at the root (`/`), no `/fr/` prefix. EN lives under `/en/`. Any new route must be duplicated in both trees of `src/pages/` (`pages/x.astro` and `pages/en/x.astro`).

### Blog content
- One post = two Markdown files, one per language, linked by the `translationId` field (same value on both sides) defined in `content.config.ts`. That is what lets the language switch find the translated post.
- Schema (`src/content.config.ts`) : `title`, `description`, `date` (coercible), `tags: string[]` (default `[]`), `draft: boolean` (default `false`), `translationId: string` (required).
- FR and EN slugs can differ (the slug comes from the filename via the `glob` loader) — `translationId`, not the slug, links the two versions.

### Design system
- `src/styles/tokens.css` is the visual source of truth (colors, typography, spacing, radii, shadows, motion). Any new style value must come from an existing token or a new token added here — no magic values in components.
- Palette: near-black background, "signal" teal/green accent (blue team, primary use), "alert" red accent (red team, used sparingly). System fonts only (`--font-sans`/`--font-mono`), no external web font (perf + privacy).
- If a Claude Design canvas is used in parallel for this site, any value changed there must be mirrored into `tokens.css` (and vice-versa) — this file must never diverge.

### Code style
- Astro components: one component = one `.astro` file, typed props, no heavy business logic (keep it in `i18n/utils.ts` or equivalent).
- Zero client JS by default: only add JS (`<script>` in an `.astro`) for a real interactive need (e.g. `LanguageToggle`), never by default.

## Tests & CI

```bash
npm run check      # astro check — type checking
npm run test:unit  # Vitest — tests/unit/
npm run test:e2e   # build + astro preview + Playwright — tests/e2e/
npm test           # both
```

CI (`.github/workflows/ci.yml`) runs `check` → `test:unit` → Playwright browser install → `test:e2e` on every push and PR, Node 22. The Playwright report is uploaded only on failure.

Before proposing a change as done: run `npm run check` and the relevant tests. Any new route or interactive component deserves an e2e test; any new pure function in `i18n/utils.ts` deserves a unit test.

## Project skills

See `.claude/skills/`:
- `new-blog-post` — scaffolds an FR+EN post with coherent frontmatter and `translationId`.
- `add-i18n-string` — adds a translation key while keeping `ui.fr`/`ui.en` in sync.
- `sync-design-tokens` — checks `tokens.css` consistency as the design system source of truth.
- `astro` — official Astro guide (astrolicious/agent-skills): SSG, components, content collections, CLI, deployment. Consult for any structural Astro decision.
- `publishing-astro-websites` — comprehensive Astro guide (SpillwaveSolutions): Content Layer API, Markdown/MDX, i18n, patterns (pagination, tags, RSS), perf, Vitest/Playwright tests, deployment.
- `astro-framework` — Astro 5+/6+ specialist (delineas/astro-framework-agents) with `references/` and `rules/`: islands, hydration, loaders, i18n routing, view transitions.

## Known todos / debt

- `src/components/Footer.astro` and `src/components/ContactCTA.astro` contain placeholder URLs for GitHub/LinkedIn (`https://github.com/`, `https://www.linkedin.com/`) — to be replaced with the real profiles.

## Maintaining this file

This file must be updated on every structural change: new major dependency, new directory under `src/`, i18n/content/design convention change, CI pipeline change. Do not duplicate what is already authoritative elsewhere (e.g. the exact npm scripts list lives in `package.json`) — point to the source instead of copying it when it changes often.