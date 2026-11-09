# Design system — johannlaqua.com

> Living reference. Source of truth for values: `src/styles/tokens.css`.
> Any change to a token is mirrored here (and in the claude.ai Project doc
> `claude/design-system.md`). Last update: 2026-11-10 (v2.1).

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
| **Electric blue** (brand) | `--blue-500` | `#2F6BFF` | Primary buttons, announcement bar, chart curve, featured card border, focus ring |
| Blue hover | `--blue-600` | `#2459E0` | Hover of filled buttons |
| Blue text on charcoal | `--blue-300` | `#8FB0FF` | Links, icons (7.8:1) |
| Blue text on sand | `--blue-700` | `#1D46C4` | Links in the sand tone (4.8:1) |
| On blue | `--on-blue` | `#FFFFFF` | Text on blue fills (4.5:1) |
| Glass | `--charcoal-glass` | charcoal at 72 % | Cards over imagery, sticky header |
| Veil / hairline | `--sand-veil` / `--sand-hairline` | sand at 6 % / 14 % | Quiet button fill / all hairlines and card borders |
| Glow | `--blue-glow` | blue at 22 % | Soft glow under primary button, featured card, contact panel |

**Accessibility rule.** `#2F6BFF` is never used for small text (3.7:1 on
charcoal): text links use `--link` (= `--blue-300` on charcoal).

### Tones

`<body class="tone-charcoal">` is the default. `.tone-sand` exists for a
light band if ever needed. Both redefine the semantic tokens components
use: `--surface`, `--surface-raised`, `--surface-card`, `--text`,
`--text-muted`, `--text-faint`, `--rule`, `--rule-strong`, `--link`,
`--accent-stroke`.

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
("Je construis des logiciels solides, *et je les sécurise.*"). Stats are
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
- **Hero**: kicker → headline with italic ending → subtitle → primary + quiet buttons → availability pulse; stats row split by hairlines; generated **network map** (`NetworkField.astro`) on the right fading into charcoal — sand hairline nodes and links crossed by one electric-blue attack path from an entry node (dashed ring) to a target (blue ring), drawn once on load; glass **method chart** card (`MethodChart.astro`) overlapping it; faint vertical column guides (`.guides`).
- **Sections** (`Section.astro` + `SectionHeading.astro`): kicker, title + optional italic `accent`, subtitle.
- **Cards** (`.card`): glass background, hairline border, `--radius-md` 12 px. Services: icon tile + title + text; the featured one (pentest) has a blue border, glow and "Populaire" pill. Journal: date + tag pill + title + text + "Lire l'article".
- **Contact**: large raised panel with blue glow and guides, title with italic ending, primary email button.
- Radii: `--radius-sm` 8 px (buttons), `--radius-md` 12 px (cards), `--radius-lg` 18 px (panels), pills `--radius-full`.

### The chart

An *illustrative* diagram, not data: delivery speed (blue curve with a
fading area) rises across Cadrage → Build → Revue sécu → Prod while
technical debt (dashed sand line) stays flat. Keep it free of invented
figures.

## Motion

One load moment on the home page: hero text and chart card rise in, the
blue curve draws (1.8 s). Hover feedback only otherwise.
`prefers-reduced-motion` disables all of it.

## Rules for evolving the system

- New value → `tokens.css` first, then this doc. No raw hex/rgba in components (exception: `<meta name="theme-color">`).
- Blue stays for actions, links, the curve and the single featured card.
- The italic serif accent is used once per heading, at its end — never mid-sentence.
- New section → `Section` + `SectionHeading` (kicker, title, accent).

## Changelog

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
