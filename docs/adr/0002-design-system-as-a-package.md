# 0002 — The design system is a package the site consumes

Date: 2026-11-11 · Status: accepted

## Context

Tokens and base styles lived in `src/styles/` of the site, the reference in
`docs/`, and a specimen page in a folder that copied the tokens with a sync
script. Three places to keep aligned.

## Decision

`packages/design-system` is the single source: `src/tokens.css`,
`src/global.css`, the font dependencies, the hero visual's geometry, the
specimen page and the reference (`README.md`). The site imports it
(`@johannlaqua/design-system`); it holds no visual value of its own.

## Why

- Nothing to synchronise: the specimen and the site read the same files.
- The boundary is enforced by the import direction, not by discipline.
- Generated files (`tokens/tokens.json`, `assets/network-field.svg`) are
  checked in CI (`npm run check`), so they cannot go stale silently.

## Cost

- The package ships source CSS, not a build: it is only usable by a bundler
  that resolves CSS imports (Astro/Vite does).
- Astro components stay in the site. Move them to the package only if a
  second app needs them.
