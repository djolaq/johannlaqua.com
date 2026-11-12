import { expect, test } from '@playwright/test';

const SITE = 'https://johannlaqua.com';

// Newest first: the two posts exist in both locales with the same dates.
const fr = { newer: '/blog/ia-boosted-dev-sans-dette/', older: '/blog/penser-comme-un-attaquant/' };
const en = { newer: '/en/blog/ai-boosted-dev-without-debt/', older: '/en/blog/thinking-like-an-attacker/' };

test.describe('post breadcrumb', () => {
  for (const { lang, path, home, blog, homeHref, blogHref } of [
    { lang: 'fr', path: fr.older, home: 'Accueil', blog: 'Journal', homeHref: '/', blogHref: '/blog/' },
    { lang: 'en', path: en.older, home: 'Home', blog: 'Blog', homeHref: '/en/', blogHref: '/en/blog/' },
  ]) {
    test(`${lang}: shows Home › Blog › Post`, async ({ page }) => {
      await page.goto(path);
      const crumbs = page.getByRole('navigation', { name: lang === 'fr' ? 'Fil d’Ariane' : 'Breadcrumb' });

      await expect(crumbs.getByRole('listitem')).toHaveCount(3);
      await expect(crumbs.getByRole('link', { name: home })).toHaveAttribute('href', homeHref);
      await expect(crumbs.getByRole('link', { name: blog })).toHaveAttribute('href', blogHref);
      const current = crumbs.locator('[aria-current="page"]');
      await expect(current).toHaveText((await page.getByRole('heading', { level: 1 }).textContent())!.trim());
    });
  }
});

test.describe('previous / next navigation', () => {
  test('the older post links forward to the newer one only', async ({ page }) => {
    await page.goto(fr.older);
    const nav = page.getByRole('navigation', { name: 'Autres articles' });

    await expect(nav.locator('a[rel="next"]')).toHaveAttribute('href', fr.newer);
    await expect(nav.locator('a[rel="prev"]')).toHaveCount(0);
  });

  test('the newer post links back to the older one only', async ({ page }) => {
    await page.goto(en.newer);
    const nav = page.getByRole('navigation', { name: 'More posts' });

    await expect(nav.locator('a[rel="prev"]')).toHaveAttribute('href', en.older);
    await expect(nav.locator('a[rel="next"]')).toHaveCount(0);
    await expect(nav).toContainText('Previous post');
  });

  test('no related-posts section when no other post shares a tag', async ({ page }) => {
    await page.goto(fr.newer);
    await expect(page.getByRole('heading', { name: 'Sur le même sujet' })).toHaveCount(0);
  });
});

test.describe('dates', () => {
  test('cards and posts render the same localized date with a machine-readable datetime', async ({ page }) => {
    await page.goto('/blog/');
    const card = page.locator(`a[href="${fr.newer}"] time`);
    await expect(card).toHaveAttribute('datetime', '2026-06-12');
    await expect(card).toHaveText('12 juin 2026');

    await page.goto(fr.newer);
    const post = page.locator('.post__meta time');
    await expect(post).toHaveAttribute('datetime', '2026-06-12');
    await expect(post).toHaveText('12 juin 2026');

    await page.goto(en.newer);
    await expect(page.locator('.post__meta time')).toHaveText('12 June 2026');
  });
});

test.describe('announcement bar', () => {
  test('promotes the latest post everywhere except on that post', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.announce a')).toHaveAttribute('href', fr.newer);

    await page.goto(fr.older);
    await expect(page.locator('.announce')).toHaveCount(1);

    await page.goto(fr.newer);
    await expect(page.locator('.announce')).toHaveCount(0);

    await page.goto(en.newer);
    await expect(page.locator('.announce')).toHaveCount(0);
  });
});

test.describe('tag pages', () => {
  test('the blog index links every topic, and "All" is current', async ({ page }) => {
    await page.goto('/blog/');
    const filter = page.getByRole('navigation', { name: 'Filtrer par sujet' });

    await expect(filter.getByRole('link', { name: 'Tous' })).toHaveAttribute('aria-current', 'page');
    await expect(filter.getByRole('link', { name: '#securite' })).toHaveAttribute('href', '/blog/tags/securite/');
  });

  test('a post links its tags to their pages', async ({ page }) => {
    await page.goto(en.older);
    await expect(page.locator('.post__meta').getByRole('link', { name: '#security' })).toHaveAttribute(
      'href',
      '/en/blog/tags/security/',
    );
  });

  for (const { lang, path, other, count, title } of [
    { lang: 'fr', path: '/blog/tags/securite/', other: '/en/blog/tags/security/', count: 1, title: /Sujet : #securite/ },
    { lang: 'en', path: '/en/blog/tags/red-team/', other: '/blog/tags/red-team/', count: 1, title: /Topic: #red-team/ },
  ]) {
    test(`${lang}: ${path} lists its posts with canonical + reciprocal hreflang`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page).toHaveTitle(title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('.journal article')).toHaveCount(count);
      await expect(page.locator('.tag-filter [aria-current="page"]')).toHaveText(/#/);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}${path}`);
      const otherLang = lang === 'fr' ? 'en' : 'fr';
      await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href', `${SITE}${path}`);
      await expect(page.locator(`link[hreflang="${otherLang}"]`)).toHaveAttribute('href', `${SITE}${other}`);

      // Reciprocity: the counterpart points back here.
      await page.goto(other);
      await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href', `${SITE}${path}`);
    });
  }

  test('the language toggle on a tag page goes to the translated topic', async ({ page }) => {
    await page.goto('/blog/tags/ia/');
    await expect(page.locator('a.lang-toggle')).toHaveAttribute('href', '/en/blog/tags/ai/');
  });
});
