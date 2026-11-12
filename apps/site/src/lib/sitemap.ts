// Per-URL sitemap metadata: the FR/EN alternates and `lastmod`.
// `@astrojs/sitemap` pairs locales by path shape only (`/x/` ↔ `/en/x/`), which
// misses every page whose slug is translated (posts, legal pages). The pairs
// are therefore listed here explicitly and applied in the sitemap `serialize`.
import { legal } from '../data/legal';
import { findTranslationIssues, postPath, readPostFiles } from './blog-files';

export interface SitemapMeta {
  fr: string;
  en: string;
  lastmod?: Date;
}

/** Translated pages outside the blog collection, as `[fr, en]` paths. */
const PAGE_PAIRS = {
  home: ['/', '/en/'],
  blog: ['/blog/', '/en/blog/'],
  legalNotice: ['/mentions-legales/', '/en/legal-notice/'],
  privacy: ['/confidentialite/', '/en/privacy/'],
} as const;

const latest = (dates: Date[]) =>
  dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;

/** Map of pathname → alternates + lastmod, for every localised URL of the site. */
export function buildSitemapMeta(blogDir: string): Map<string, SitemapMeta> {
  const posts = readPostFiles(blogDir).filter((p) => !p.draft);
  const issues = findTranslationIssues(posts);
  if (issues.length) throw new Error(`Blog translations are inconsistent:\n${issues.join('\n')}`);

  const meta = new Map<string, SitemapMeta>();
  const add = ([fr, en]: readonly [string, string], lastmod?: Date) => {
    meta.set(fr, { fr, en, lastmod });
    meta.set(en, { fr, en, lastmod });
  };

  const lastPost = latest(posts.map((p) => p.date));
  add(PAGE_PAIRS.home, lastPost);
  add(PAGE_PAIRS.blog, lastPost);
  add(PAGE_PAIRS.legalNotice, new Date(legal.lastUpdated));
  add(PAGE_PAIRS.privacy, new Date(legal.lastUpdated));

  for (const fr of posts.filter((p) => p.locale === 'fr')) {
    const en = posts.find((p) => p.locale === 'en' && p.translationId === fr.translationId)!;
    add([postPath(fr), postPath(en)], fr.date);
  }
  return meta;
}
