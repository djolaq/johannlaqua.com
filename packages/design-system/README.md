# Design system — johannlaqua.com

> Living reference. Source of truth for values: `src/tokens.css` (this package).
> Any change to a token is mirrored here (and in the claude.ai Project doc
> `claude/design-system.md`). Last update: 2026-11-12 (v2.4).

## This package

`@johannlaqua/design-system` — imported by the site (`apps/site`), depends on nothing else in the repo.

| Path | Content |
|---|---|
| `src/tokens.css` | Every visual value (custom properties). **Edit here.** |
| `src/global.css` | Reset, tones, `.card`, `.kicker`, `.accent`, `.guides`, `.prose`, `.link`, `.target`, user-preference media queries |
| `src/fonts.css` | Self-hosted fonts through `@fontsource` |
| `src/index.css` | Fonts + base styles: what a consumer imports (`import '@johannlaqua/design-system'`) |
| `src/network-field.js` | Geometry of the hero visual, shared by the site and the SVG export |
| `tokens/tokens.json` | Generated: the tokens as JSON (Figma / Tokens Studio…) |
| `assets/` | `network-field.svg` (generated), `mark.svg`, `favicon.svg` |
| `specimen/index.html` | Visual reference page — open it from disk after `npm install` at the repo root |
| `references/` | The inspiration image and what was kept from it |

After changing tokens or the hero geometry, run `npm run design:build` from
the repo root. `npm run check` (and CI) fails if the generated files are stale.

## Idea in one line

**A dark, cinematic tech page.** Charcoal everywhere, sand for text, a
generated network map sinking into the dark, translucent "glass" cards, and
electric blue for actions and the one data curve. Inspired by modern
infrastructure-software landing pages (reference shared by Johann:
dark hero, sepia photo, sans headline with an italic serif ending,
tracked-caps kicker, glass chart card, stats split by hairlines).

## Colour

| Role | Token | Hex | Use |
|---|---|---|---|
| **Charcoal** (brand) | `--charcoal-900` | `#1E1E1C` | The page background (default tone) |
| Charcoal deep | `--charcoal-950` | `#161614` | Code blocks |
| Charcoal raised | `--charcoal-800` | `#2A2A27` | Raised panels (contact panel) |
| Charcoal rule | `--charcoal-700` | `#3A3935` | Strong rules |
| Charcoal decor | `--charcoal-500` | `#7C756A` | Decorative only (3.7:1) |
| **Sand** (brand) | `--sand-300` | `#D8CBB3` | Headlines and body text on charcoal; sand tone background |
| Sand muted | `--sand-500` | `#A39A88` | Muted text on charcoal (6:1) |
| Sand light / rule / ink | `--sand-50` `--sand-400` `--sand-ink-600/700` | `#ECE4D5` `#C6B89D` `#6E675B` `#57524A` | Only for the optional `.tone-sand` band |
| **Electric blue** (brand) | `--blue-500` | `#2F6BFF` | Chart curve, focus ring, strokes, the hero pulse — never behind text |
| Fill (actions) | `--accent-fill` | `#2459E0` | Primary buttons, announcement bar, skip link (white text 5.9:1) |
| Fill hover | `--accent-fill-hover` | `#1D46C4` | Hover of filled actions |
| Blue text on charcoal | `--blue-300` | `#8FB0FF` | Links, icons (7.8:1) |
| Blue text on sand | `--blue-700` | `#1D46C4` | Links in the sand tone (4.8:1) |
| On blue | `--on-blue` | `#FFFFFF` | Text on `--accent-fill` fills (5.9:1) |
| Glass | `--charcoal-glass` | charcoal at 72 % | Cards over imagery, sticky header |
| Veil / hairline | `--sand-veil` / `--sand-hairline` | sand at 6 % / 14 % | Quiet button fill / all hairlines and card borders |
| Glow | `--blue-glow` | blue at 22 % | Soft glow under primary button, featured card, contact panel |

**Accessibility rule.** `#2F6BFF` is never used for small text (3.7:1 on
charcoal): text links use `--link` (= `--blue-300` on charcoal). It is not
used behind white text either — `#2F6BFF` + white is 4.499:1, just under AA;
filled surfaces use `--accent-fill` (`#2459E0`, 5.9:1).

### Tones

`<body class="tone-charcoal">` is the default. `.tone-sand` exists for a
light band if ever needed. Both redefine the semantic tokens components
use: `--surface`, `--surface-raised`, `--surface-card`, `--text`,
`--text-muted`, `--text-faint`, `--rule`, `--rule-strong`, `--link`,
`--accent-stroke`, `--accent-fill`, `--accent-fill-hover`.

## Typography

Three self-hosted fonts (`@fontsource*`, bundled at build — no request
to Google Fonts, the privacy policy stays true).

| Family | Token | Role |
|---|---|---|
| **Geist** (variable) | `--font-sans` | Everything by default: headlines (500, tight tracking), body (400), UI (500–600), stats (300) |
| **Instrument Serif** (regular + italic) | `--font-serif` | The italic ending of headlines (`.accent`), quotes, the About "result" line, article ledes, the 404 numeral |
| **JetBrains Mono** (variable) | `--font-mono` | Code, dates, chart axis, the email address |

**Weight & style contrast** is the signature of the type: a medium,
tightly tracked sans headline that ends in a light italic serif
("I build software that holds up, *and make it hard to break.*"). Stats are
set large in Geist Light. Kickers are small tracked capitals.

### Scale (Bringhurst)

`--text-xs` 12 · `--text-sm` 14 · `--text-base` 16 (body) · `--text-md` 18 ·
`--text-lg` 21 · `--text-xl` 24 · `--text-2xl` 36 · `--text-3xl` 48 ·
`--text-4xl` 60 · `--text-5xl` 72 px, plus fluid `--text-hero`
(44 → 84 px). Tracking: `--tracking-display` −0.035em on big headlines,
`--tracking-caps` 0.16em on kickers.

## Layout & components

- Container 76 rem + gutter (24 / 48 px). Content left-aligned.
- **Announcement bar** (`AnnouncementBar.astro`): blue strip linking to the latest journal post.
- **Header**: brand in tracked caps with a blue bolt mark, nav, language toggle, "Me contacter" quiet button. Sticky, glass.
- **Hero**: kicker → headline with italic ending → subtitle → primary + quiet buttons → discipline pulse; stats row split by hairlines; generated **network map** (`NetworkField.astro`) on the right fading into charcoal — sand hairline nodes and links crossed by one electric-blue attack path from an entry node (dashed ring) to a target (blue ring), drawn once on load; glass **method chart** card (`MethodChart.astro`) overlapping it; faint vertical column guides (`.guides`).
- **Sections** (`Section.astro` + `SectionHeading.astro`): kicker, title + optional italic `accent`, subtitle.
- **Cards** (`.card`): glass background, hairline border, `--radius-md` 12 px. Skills: tracked mono tag + title + text + mono item list split by a hairline, `>` markers in `--link`. Lab: mono repo name + text + stack chips (hairline pills) + “Voir le code” link. Journal: date + tag pill + title + text + “Lire l’article”.
- **Contact**: large raised panel with blue glow and guides, primary email button.
- Radii: `--radius-sm` 8 px (buttons), `--radius-md` 12 px (cards), `--radius-lg` 18 px (panels), pills `--radius-full`.

### The chart

An *illustrative* diagram, not data: delivery speed (blue curve with a
fading area) rises across Scoping → Build → Security review → Prod while
technical debt (dashed sand line) stays flat. Keep it free of invented
figures.

## Motion

One load moment on the home page: hero text and chart card rise in, the
blue curve draws (1.8 s). Hover feedback only otherwise.
`prefers-reduced-motion` disables all of it.

## User preferences & accessibility

- **`prefers-contrast: more`**: `--text-muted` moves to `--sand-400`
  (`--charcoal-800` in the sand tone), `--rule` becomes a visible
  `--sand-500` line, glass cards turn opaque (`--charcoal-800`, no blur).
- **Targets**: `--target-min` (24 px, WCAG 2.2 SC 2.5.8) and the `.target`
  utility give a standalone link a 24 × 24 px hit area without moving its text.
- **Focus**: one ring for everything, `--blue-500` 2 px at 3 px offset.
  Programmatic focus targets (`[tabindex="-1"]`, e.g. `<main>` after the skip
  link) get no ring.
- **Reflow**: headings wrap long words (`overflow-wrap: break-word`,
  `hyphens: auto`) so nothing scrolls sideways at 320 px.

## Rules for evolving the system

- New value → `src/tokens.css` first, then this doc, then `npm run design:build`. No raw hex/rgba in components (exception: `<meta name="theme-color">`).
- Blue stays for actions, links, the curve and the single featured card.
- The italic serif accent is used once per heading, at its end — never mid-sentence.
- New section → `Section` + `SectionHeading` (kicker, title, accent).

## Changelog

- **v2.4 — 2026-11-12**: accessibility lot D. New `--target-min` token and
  `.target` utility (24 px targets); `prefers-contrast: more` tones; no focus
  ring on `[tabindex="-1"]`; headings wrap long words. Header: the language
  switch shows both languages (current one underlined in `--accent-stroke`, like
  the current nav item), and the "Me contacter" button is hidden below 26em
  where the row cannot fit it.

- **v2.3 — 2026-11-11**: accessibility pass from the site audit. New semantic
  `--accent-fill` (`#2459E0`) / `--accent-fill-hover` (`#1D46C4`) for surfaces
  carrying white text — white on `--blue-500` was 4.499:1, just under AA;
  `--blue-500` keeps strokes, focus rings and the chart curve. New
  `--scroll-offset` token (96px, `header + 4rem` below 48em) so anchors clear
  the wrapped mobile header.

- **v2.2 — 2026-11-11**: no visual change. The design system becomes its own
  workspace package (`packages/design-system`) consumed by the site; hero
  geometry shared through `src/network-field.js`; specimen page, JSON token
  export and reference image added.

- **v2.2 — 2026-11-11**: merged the skills/lab showcase (PR #22) into the v2
  system: Skills cards (mono tag + item list) and Lab cards (repo name +
  stack chips) replace the old service cards; no featured/blue card anymore,
  no “Populaire” pill. Contact panel title is plain (no italic ending) and
  no longer sells a project.

- **v2.1 — 2026-11-10**: GitHub photo removed from the site (asset, fetch
  script and test deleted). The hero visual is now a deterministic SVG
  network map with a blue attack path — no image request at all.

- **v2 — 2026-11-10**: rework after Johann's feedback ("c'est moche") and
  his reference image. Dark charcoal page, Geist + Instrument Serif
  italic accents (replacing Bricolage Grotesque + Newsreader), duotone
  portrait hero, glass cards, method chart, announcement bar, stats
  row, softer radii.
- **v1 — 2026-11-10**: first charcoal / sand / electric-blue system
  (editorial, sand page, condensed heavy headlines). Rejected.
