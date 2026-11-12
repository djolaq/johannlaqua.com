import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildSitemapMeta } from '../../src/lib/sitemap';

// A throwaway blog directory, so the assertions do not depend on the real posts.
function blogDir(posts: { locale: 'fr' | 'en'; slug: string; id: string; date: string; tags: string[] }[]) {
  const dir = mkdtempSync(join(tmpdir(), 'sitemap-'));
  for (const locale of ['fr', 'en']) mkdirSync(join(dir, locale));
  for (const p of posts) {
    writeFileSync(
      join(dir, p.locale, `${p.slug}.md`),
      `---\ntitle: "${p.slug}"\ndate: ${p.date}\ntags: ${JSON.stringify(p.tags)}\ntranslationId: "${p.id}"\n---\n`,
    );
  }
  return dir;
}

describe('buildSitemapMeta — tag pages', () => {
  const meta = buildSitemapMeta(
    blogDir([
      { locale: 'fr', slug: 'a', id: 'a', date: '2026-01-10', tags: ['securite', 'red-team'] },
      { locale: 'en', slug: 'a', id: 'a', date: '2026-01-10', tags: ['security', 'red-team'] },
      { locale: 'fr', slug: 'b', id: 'b', date: '2026-03-02', tags: ['securite'] },
      { locale: 'en', slug: 'b', id: 'b', date: '2026-03-02', tags: ['ops'] },
    ]),
  );

  it('pairs tags by position across translations, both ways', () => {
    expect(meta.get('/blog/tags/red-team/')).toMatchObject({ fr: '/blog/tags/red-team/', en: '/en/blog/tags/red-team/' });
    expect(meta.get('/en/blog/tags/red-team/')).toMatchObject({ fr: '/blog/tags/red-team/', en: '/en/blog/tags/red-team/' });
  });

  it('falls back to the other locale’s blog index when translations disagree', () => {
    // `securite` maps to `security` in post a but to `ops` in post b.
    expect(meta.get('/blog/tags/securite/')).toMatchObject({ fr: '/blog/tags/securite/', en: '/en/blog/' });
    // Pairing is computed per direction: seen from EN, `ops` has one candidate.
    expect(meta.get('/en/blog/tags/ops/')).toMatchObject({ fr: '/blog/tags/securite/', en: '/en/blog/tags/ops/' });
  });

  it('dates a tag page by its newest post', () => {
    expect(meta.get('/blog/tags/securite/')?.lastmod?.toISOString().slice(0, 10)).toBe('2026-03-02');
    expect(meta.get('/blog/tags/red-team/')?.lastmod?.toISOString().slice(0, 10)).toBe('2026-01-10');
  });
});
