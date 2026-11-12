import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findTranslationIssues, postPath, readPostFiles } from '../../src/lib/blog-files';

const blogDir = fileURLToPath(new URL('../../src/content/blog', import.meta.url));

const post = (locale: 'fr' | 'en', slug: string, translationId: string, draft = false) => ({
  locale,
  slug,
  translationId,
  draft,
});

describe('blog content', () => {
  it('pairs every translationId with exactly one FR and one EN post', () => {
    const posts = readPostFiles(blogDir);
    expect(posts.length).toBeGreaterThan(0);
    expect(findTranslationIssues(posts)).toEqual([]);
  });

  it('gives every post a valid date', () => {
    for (const p of readPostFiles(blogDir)) expect(Number.isNaN(p.date.getTime()), `${p.locale}/${p.slug}`).toBe(false);
  });
});

describe('findTranslationIssues', () => {
  it('accepts a complete pair', () => {
    expect(findTranslationIssues([post('fr', 'a', 'x'), post('en', 'b', 'x')])).toEqual([]);
  });

  it('flags an orphan post (missing translation)', () => {
    expect(findTranslationIssues([post('fr', 'a', 'x')])).toEqual(['translationId "x": 0 EN post(s), expected 1']);
  });

  it('flags a duplicated translation', () => {
    const issues = findTranslationIssues([post('fr', 'a', 'x'), post('fr', 'c', 'x'), post('en', 'b', 'x')]);
    expect(issues).toEqual(['translationId "x": 2 FR post(s), expected 1']);
  });

  it('flags a pair whose draft status differs', () => {
    const issues = findTranslationIssues([post('fr', 'a', 'x', true), post('en', 'b', 'x')]);
    expect(issues).toEqual(['translationId "x": draft status differs between translations']);
  });

  it('flags a missing translationId', () => {
    expect(findTranslationIssues([post('en', 'b', '')])).toEqual(['en/b: missing translationId']);
  });
});

describe('postPath', () => {
  it('puts FR at the root and EN under /en/, with a trailing slash', () => {
    expect(postPath({ locale: 'fr', slug: 'a' })).toBe('/blog/a/');
    expect(postPath({ locale: 'en', slug: 'b' })).toBe('/en/blog/b/');
  });
});
