---
name: sync-design-tokens
description: Check and maintain packages/design-system/src/tokens.css as the single source of truth for johannlaqua.com's design system (colors, type scale, spacing, radii, motion). Use when the user wants to change site styling/colors/spacing, add a new visual component, or mentions syncing with a Claude Design canvas.
---

# sync-design-tokens

Keeps `packages/design-system/src/tokens.css` the single source of truth of johannlaqua.com's design system, and spots drift.

## Context

`packages/design-system/src/tokens.css` defines every visual value as CSS custom properties on `:root`. The full reference (roles, contrasts, rules, changelog) is `packages/design-system/README.md` — **the two must stay in sync**, as must the `claude/design-system.md` doc of the claude.ai Project.

- Raw palette: `--charcoal-*` (950/900/800/700/500), `--sand-*` (50/300/400/500, `--sand-ink-600/700`), `--blue-*` (300/500/600/700), `--on-blue`
- Translucent layers: `--charcoal-glass`, `--sand-veil`, `--sand-hairline`, `--blue-glow`
- Semantic tokens: `--surface`, `--surface-raised`, `--surface-card`, `--text`, `--text-muted`, `--text-faint`, `--rule`, `--rule-strong`, `--link`, `--accent-stroke` — redefined by `.tone-charcoal` (default) / `.tone-sand` in `global.css`. Components use ONLY these (plus `--blue-500`/`--on-blue` for filled buttons).
- Type: `--font-sans` (Geist), `--font-serif` (Instrument Serif, italic accents), `--font-mono` (JetBrains Mono); scale `--text-xs`→`--text-5xl` + `--text-hero`/`--text-poster`; `--leading-*`, `--weight-*`, `--tracking-*` (including `--tracking-caps`)
- Spacing: `--space-1` to `--space-10` (4px base)
- Layout: `--content-width`, `--content-width-narrow`, `--measure`, `--gutter`, `--header-height`, `--announce-height`
- Radii: `--radius-xs/sm/md/lg/full`; elevation: `--shadow-card`, `--blur-glass`; lines: `--line-hair/bold`, `--underline-*`
- Motion: `--ease-out`, `--duration-fast/base/reveal/trace`
- Z-index: `--z-header`, `--z-overlay`

`packages/design-system/src/global.css` holds the reset, the tones, `.card`, `.kicker`, `.accent`, `.guides`, `.prose` and `.link` — token usages only.

## When to use it

- Before creating a new `.astro` component: check that the value you need (colour, spacing, radius, shadow) does not already exist as a token before hardcoding a new one.
- When the user asks for a visual change (colour, text size, spacing): change the token in `tokens.css`, not the value in the component, unless it is a genuine one-off (and then flag it explicitly as an exception).
- When the user mentions a Claude Design canvas or Figma: compare the values and propose a diff of the tokens to update.

## Steps

1. Read `packages/design-system/src/tokens.css` for the current state.
2. If the request comes from a change made elsewhere (Design canvas, mockup), identify exactly which custom properties must change — never duplicate a raw value in a component.
3. Change values in `tokens.css` only. If a component uses a hardcoded magic value (quick `grep` over the `.astro` files for hex colours, suspicious `px`/`rem`), propose replacing it with the matching token.
4. If a new value is needed and has no equivalent, add it to the right section of `tokens.css` with a name consistent with the existing convention (`--category-name[-variant]`), not directly in a component.
5. Update `packages/design-system/README.md` (relevant table + a changelog line), then run `npm run design:build` from the repo root to regenerate `tokens/tokens.json` and `assets/network-field.svg` (CI fails if they are stale).
6. Check visually in local dev (`npm run dev`) that the change has the expected effect, on FR and EN pages where relevant.

## Verification

`grep` over `apps/site/src/components/**/*.astro` and `apps/site/src/layouts/**/*.astro` for hardcoded colour values (`#`, `rgb`, `rgba`) or sizes that should be tokens — a "source of truth" that leaks into components ends up drifting silently.
