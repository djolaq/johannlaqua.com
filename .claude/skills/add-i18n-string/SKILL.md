---
name: add-i18n-string
description: Add or update a UI translation string in johannlaqua.com's i18n dictionary, keeping the FR and EN key sets in sync. Use when the user asks to add new UI text, a new label/button/heading, or change existing site copy.
---

# add-i18n-string

Adds or changes a UI string on johannlaqua.com without ever letting the FR and EN keys drift apart.

## Context

Every user-facing string lives in `apps/site/src/i18n/ui.ts`, in two objects `ui.fr` and `ui.en` with exactly the same set of keys. The `UiKey` type (`export type UiKey = keyof (typeof ui)['fr']`) is derived from `ui.fr` — so `fr` is authoritative for typing, but both objects must stay aligned in practice.

`useTranslations(locale)` (in `apps/site/src/i18n/utils.ts`) returns a `t(key)` function that silently falls back to `ui[defaultLocale][key]` when a key is missing in `en`. A forgotten key therefore does not break the build: it shows French on the English site without any warning. Avoid the omission; do not rely on the fallback.

Keys follow a `section.element` or `section.element.variant` convention (e.g. `hero.cta.primary`, `announce.badge`), grouped by page section in the file (site, nav, hero, about, skills, lab, blog, contact, footer, legal…).

## Steps

1. Find the relevant section in `apps/site/src/i18n/ui.ts` (or create one for a new component or page section).
2. Pick a key consistent with the existing convention (`section.element[.variant]`).
3. Add the key and its FR value to `ui.fr`, **and immediately after** the key and its EN value to `ui.en`, at the same relative position in both objects (same order, so diffs stay readable).
4. Use the new key in the `.astro` component through `t('section.element')` — never hardcode text.
5. Never add a key to only one of the two objects. If the exact FR or EN wording is not known yet, use a clearly identifiable placeholder (e.g. `[FR] ...` / `[EN] ...`) rather than leaving the key out.

## Verification

After the change, re-read `ui.fr` and `ui.en` and confirm they have the same number of keys and the same key names. Run `npm run check` from the repo root (the `UiKey` typing reports a key used through `t()` that does not exist in FR, but it does not detect a key missing in EN — the manual re-read is still required).
