# Design system — johannlaqua.com

> Living reference. Source of truth for values: `src/styles/tokens.css`.
> Any change to a token is mirrored here (and in the claude.ai Project doc
> `claude/design-system.md`). Last update: 2026-11-10 (v1).

## Idea in one line

**Stone and sand, with one electric trace.** A charcoal / sand two-tone
page (ink and paper), where electric blue only marks what you can *do*
(actions, links) and what the eye should *follow* (the graph line, rules).
Personality comes from typography: three families and strong weight
contrast — very heavy condensed headlines against light serif text.

## Colour

| Role | Token | Hex | Use |
|---|---|---|---|
| **Charcoal** (brand) | `--charcoal-900` | `#1E1E1C` | Ink; dark bands: header, hero, contact, footer, post header |
| Charcoal raised | `--charcoal-800` | `#2A2A27` | Raised surface on charcoal |
| Charcoal rule | `--charcoal-700` | `#3A3935` | Hairlines on charcoal |
| Charcoal decor | `--charcoal-500` | `#7C756A` | Decorative only on charcoal (3.7:1) |
| **Sand** (brand) | `--sand-300` | `#D8CBB3` | Paper — the page; text on charcoal |
| Sand light | `--sand-50` | `#ECE4D5` | Inline code, raised surface on sand |
| Sand rule | `--sand-400` | `#C6B89D` | Hairlines on sand |
| Sand muted | `--sand-500` | `#A39A88` | Muted text on charcoal (6:1) |
| Ink muted | `--sand-ink-700` | `#57524A` | Muted text on sand (4.8:1) |
| Ink decor | `--sand-ink-600` | `#6E675B` | Decorative only on sand (3.5:1) |
| **Electric blue** (brand) | `--blue-500` | `#2F6BFF` | Filled buttons, graph strokes, rules, focus ring, selection |
| Blue hover | `--blue-600` | `#2459E0` | Hover of filled buttons |
| Blue on charcoal | `--blue-300` | `#8FB0FF` | Blue **text** on charcoal (7.8:1) |
| Blue on sand | `--blue-700` | `#1D46C4` | Blue **text** on sand (4.8:1) |
| On blue | `--on-blue` | `#FFFFFF` | Text on a blue fill (4.5:1) |

**Accessibility rule.** Pure `#2F6BFF` is never used for small text:
it is 3.7:1 on charcoal and 2.8:1 on sand. For text use `--blue-300`
(on charcoal) or `--blue-700` (on sand) — the semantic token `--link`
picks the right one automatically.

### Tones (semantic tokens)

Components never use raw palette values: they use semantic tokens, which
a **tone** class redefines for its whole subtree.

| Semantic token | `.tone-sand` (default) | `.tone-charcoal` |
|---|---|---|
| `--surface` | sand-300 | charcoal-900 |
| `--surface-raised` | sand-50 | charcoal-800 |
| `--text` | charcoal-900 | sand-300 |
| `--text-muted` | sand-ink-700 | sand-500 |
| `--text-faint` | sand-ink-600 | charcoal-500 |
| `--rule` | sand-400 | charcoal-700 |
| `--rule-strong` | charcoal-900 | sand-300 |
| `--link` | blue-700 | blue-300 |
| `--accent-stroke` | blue-500 | blue-500 |

Page rhythm: charcoal header + hero → sand content (about, services,
journal) → charcoal contact + footer. Blog post: charcoal header block,
sand reading area.

## Typography

Three self-hosted variable fonts (`@fontsource-variable/*`, bundled at
build time — no request to Google Fonts, the privacy policy stays true).

| Family | Token | Role | Weights used |
|---|---|---|---|
| **Bricolage Grotesque** | `--font-display` | Headlines, navigation, buttons, labels, UI | 200 (contact poster, 404) · 500–600 (UI) · 800 (headlines) |
| **Newsreader** | `--font-text` | Reading text: body, ledes, articles, legal | 300 (ledes, subtitles) · 400 (body) |
| **JetBrains Mono** | `--font-mono` | Code; journal dates and tags (ISO log stamps) | 400 |

Bricolage's width axis is used: `--stretch-display: 82%` (78% on the hero
headline) for condensed headlines, `--stretch-ui: 100%` for UI text.

**Weight contrast is part of the identity.** Headlines: Bricolage 800,
condensed. Directly next to them: Newsreader Light 300, larger. The
contact email is a "poster" in Bricolage 200 at display size.

### Scale (Bringhurst, *Elements of Typographic Style*)

| Token | Size | Typical use |
|---|---|---|
| `--text-xs` | 12 px | Footer legal line, badge |
| `--text-sm` | 14 px | Section labels, meta, dates |
| `--text-base` | 16 px | Navigation, buttons |
| `--text-md` | 18 px | **Body text** (Newsreader) |
| `--text-lg` | 21 px | Subtitles, service descriptions |
| `--text-xl` | 24 px | Ledes, hero subtitle, prose h2 |
| `--text-2xl` | 36 px | Section titles (mobile), service titles, hop values |
| `--text-3xl` | 48 px | Page titles (mobile) |
| `--text-4xl` | 60 px | Section titles (desktop) |
| `--text-5xl` | 72 px | Blog post title (desktop) |
| `--text-hero` | 44 → 108 px fluid | Hero headline |
| `--text-poster` | 40 → 88 px fluid | Contact email |

Line height: `--leading-display` 0.95 (big headlines), `--leading-tight`
1.1, `--leading-snug` 1.3 (ledes), `--leading-text` 1.6 (serif body),
`--leading-ui` 1.45. Reading measure: `--measure` 36 rem (≈ 70 characters).

## Layout

- Container: `--content-width` 76 rem + `--gutter` (24 px mobile, 48 px ≥ 768 px).
- **Section grid** (`.section-grid`, via `Section.astro`): the section name
  sits in a left margin column (`--label-column` 11 rem) under a 2 px
  rule, like a marginal note; content takes the rest. One column below 896 px.
- Content is **left-aligned** everywhere. No centred blocks.
- Lists are **ruled rows**, not cards: services (title | description) and
  journal entries (ISO date | title + description | tags).
- Spacing: 4 px base scale `--space-1`…`--space-10`. Sections: `--space-8`
  mobile, `--space-9` desktop.
- Radii stay small (`--radius-xs` 2 px, `--radius-sm` 4 px): cut stone, not pills.

## Signature elements

1. **The trace** (hero): the three facts (10+ years · Dev & Security ·
   AI-first) are hops on one electric-blue path, hollow square nodes with
   a filled end node — a route through a system, the way an attacker maps
   one. Horizontal on desktop, vertical on mobile. It is the page's single
   orchestrated motion: it draws once on load.
2. **The registration portrait**: grayscale photo on a sand mat, offset
   from a blue frame, like a print pulled slightly out of register.
3. **The contact poster**: the email address itself is the call to
   action, huge and thin (Bricolage 200) with a blue underline.
4. **Brand mark**: a sand square with an electric-blue corner (header,
   favicon) — the palette in one glyph.

## Components

| Component | Role |
|---|---|
| `Section.astro` | Section wrapper: `label`, `tone` (`sand`/`charcoal`), `id` |
| `SectionHeading.astro` | Title (800, condensed) + light subtitle; `as="h1"` on standalone pages |
| `Button.astro` | `primary` (blue fill — the only filled colour) / `quiet` (hairline outline) |
| `ServiceCard.astro` | Ruled service row, optional blue badge |
| `BlogCard.astro` | Journal log line |
| `Avatar.astro` | Registration portrait |
| `LegalArticle.astro` | Legal pages, uses `.prose` |
| `.prose` (global.css) | Long-form text: articles, legal pages |
| `.link` (global.css) | Underlined link in `--link` colour |

## Motion

- One page-load moment on the home page: hero text rises in (900 ms,
  staggered) and the trace draws (1.8 s). Nothing else animates by itself
  except the small "available" pulse.
- Interaction feedback only: colour/underline transitions of 220 ms.
- `prefers-reduced-motion` disables all of it (global rule in `global.css`).

## Rules for evolving the system

- A new value goes into `tokens.css` first, then here; never a raw hex or
  px in a component (exception: `<meta name="theme-color">`, which needs a literal).
- Blue stays rare: actions, links, the trace, rules that guide reading.
  If two blue things compete on one screen, remove one.
- No all-caps labels, no `01/02/03` numbering unless the content is a real
  sequence, no `→` appended to links.
- New section → use `Section` + `SectionHeading`; new list → ruled rows.

## Changelog

- **v1 — 2026-11-10**: new identity. Charcoal `#1E1E1C` / Sand `#D8CBB3` /
  Electric blue `#2F6BFF`; Bricolage Grotesque + Newsreader + JetBrains Mono;
  section grid, ruled lists, hero trace, registration portrait, contact
  poster. Replaces the previous near-black + teal/red "terminal" theme and
  system fonts.
