import { expect, test } from '@playwright/test';

// A canonical URL and the `hreflang` alternate for the same locale must be
// byte-for-byte identical, trailing slash included: a mismatch sends search
// engines to a redirect and dilutes the signal.
const posts = [
  { path: '/blog/penser-comme-un-attaquant/', lang: 'fr', other: '/en/blog/thinking-like-an-attacker/' },
  { path: '/en/blog/thinking-like-an-attacker/', lang: 'en', other: '/blog/penser-comme-un-attaquant/' },
];

test.describe('canonical and hreflang', () => {
  for (const { path, lang, other } of posts) {
    test(`self alternate matches the canonical (${path})`, async ({ page }) => {
      await page.goto(path);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const self = await page
        .locator(`link[rel="alternate"][hreflang="${lang}"]`)
        .getAttribute('href');
      const counterpart = await page
        .locator(`link[rel="alternate"][hreflang="${lang === 'fr' ? 'en' : 'fr'}"]`)
        .getAttribute('href');

      expect(canonical).toMatch(/\/$/);
      expect(self).toBe(canonical);
      expect(counterpart).toMatch(new RegExp(`${other}$`));
    });
  }
});

test.describe('article metadata', () => {
  for (const { path } of posts) {
    test(`is typed as an article with a publication date (${path})`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'article',
      );
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
        'content',
        /^\d{4}-\d{2}-\d{2}T/,
      );
    });
  }

  test('the home page stays a website', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  });
});
