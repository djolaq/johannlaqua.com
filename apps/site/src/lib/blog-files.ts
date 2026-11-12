// Reads the blog's Markdown frontmatter straight from disk, without Astro's
// content layer. Used where `astro:content` is not available: the Astro config
// (sitemap alternates and `lastmod`) and the unit tests (translation parity).
// The pages themselves keep using `getCollection('blog')`.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export const blogLocales = ['fr', 'en'] as const;
export type BlogLocale = (typeof blogLocales)[number];

export interface PostFile {
  locale: BlogLocale;
  /** Filename without `.md`: the URL slug. */
  slug: string;
  translationId: string;
  date: Date;
  tags: string[];
  draft: boolean;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

export function readPostFiles(blogDir: string): PostFile[] {
  return blogLocales.flatMap((locale) =>
    readdirSync(join(blogDir, locale))
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const source = readFileSync(join(blogDir, locale, file), 'utf8');
        const data = parse(source.match(FRONTMATTER)?.[1] ?? '') ?? {};
        return {
          locale,
          slug: file.replace(/\.md$/, ''),
          translationId: String(data.translationId ?? ''),
          date: new Date(data.date),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          draft: data.draft === true,
        };
      }),
  );
}

/** Public path of a post, in the shape the site emits (trailing slash, FR at the root). */
export function postPath({ locale, slug }: Pick<PostFile, 'locale' | 'slug'>): string {
  return `${locale === 'fr' ? '' : `/${locale}`}/blog/${slug}/`;
}

/**
 * Every `translationId` must have exactly one FR and one EN post, with the same
 * draft status — otherwise the language switch, the hreflang pair and the
 * sitemap alternates silently fall back to the blog index.
 * Returns one human-readable message per problem; empty when the content is sound.
 */
export function findTranslationIssues(posts: Pick<PostFile, 'locale' | 'slug' | 'translationId' | 'draft'>[]): string[] {
  const issues: string[] = [];
  const byId = new Map<string, typeof posts>();
  for (const post of posts) {
    if (!post.translationId) {
      issues.push(`${post.locale}/${post.slug}: missing translationId`);
      continue;
    }
    byId.set(post.translationId, [...(byId.get(post.translationId) ?? []), post]);
  }
  for (const [id, group] of byId) {
    for (const locale of blogLocales) {
      const count = group.filter((p) => p.locale === locale).length;
      if (count !== 1) issues.push(`translationId "${id}": ${count} ${locale.toUpperCase()} post(s), expected 1`);
    }
    if (new Set(group.map((p) => p.draft)).size > 1) {
      issues.push(`translationId "${id}": draft status differs between translations`);
    }
  }
  return issues;
}
