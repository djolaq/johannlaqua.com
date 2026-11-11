---
name: new-blog-post
description: Scaffold a new blog post in both FR and EN for johannlaqua.com, with matching translationId and consistent frontmatter. Use when the user asks to write, add, or draft a new blog/journal article.
---

# new-blog-post

Creates a new blog post in French and in English for johannlaqua.com, correctly linked for the language switch.

## Context

The content schema lives in `apps/site/src/content.config.ts` (`blog` collection, `glob` loader on `apps/site/src/content/blog/**/*.md`). Fields:

- `title: string` (required)
- `description: string` (required)
- `date` (coercible to `Date`, e.g. `2026-09-12`)
- `tags: string[]` (default `[]`)
- `draft: boolean` (default `false`)
- `translationId: string` (**required**) — the exact same value on the FR and EN side; it is what links the two translations for the language switch (see `getAlternateLocalePath` in `apps/site/src/i18n/utils.ts`)

Files live in `apps/site/src/content/blog/fr/<slug-fr>.md` and `apps/site/src/content/blog/en/<slug-en>.md`. FR and EN slugs can differ (each comes from its file name) — only `translationId` has to match.

## Steps

1. Ask the user (if not already given): the subject/title of the post, and whether they provide the FR/EN text themselves or you should write it from a brief.
2. Pick a short kebab-case `translationId` summarising the subject (e.g. `ai-boosted-dev`), checking it does not already exist in `apps/site/src/content/blog/`.
3. Pick a file slug per language (kebab-case, derived from the title in each language). They do not need to be identical in FR and EN.
4. Create `apps/site/src/content/blog/fr/<slug-fr>.md` with the full frontmatter (`title`, `description`, today's `date` as `YYYY-MM-DD` unless told otherwise, `tags`, `translationId`) followed by the Markdown content, in a tone consistent with existing posts (see `apps/site/src/content/blog/fr/*.md` for the style: `##` headings, short paragraphs, no frills).
5. Create `apps/site/src/content/blog/en/<slug-en>.md` the same way, in English, with the **same `translationId`**.
6. Do not set `draft: true` unless the user explicitly asks for it.
7. Remind the user that no change to `apps/site/src/pages/` is needed — the `blog/[slug].astro` and `en/blog/[slug].astro` pages resolve posts dynamically through the collection.
8. Suggest running `npm run check` from the repo root to validate the frontmatter against the Zod schema.

## Verification

After creating the files, re-read both and confirm `translationId` is identical character for character in the two frontmatters — a silent mismatch breaks the language switch without any build error.
