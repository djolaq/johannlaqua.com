import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

// Every check below runs on the built site (`astro build` + `astro preview`),
// with the sitemap as the list of pages: a page added to the site is covered
// automatically.

const SITE = 'https://johannlaqua.com';
const local = (url: string) => url.replace(SITE, '');

async function sitemapEntries(request: APIRequestContext) {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1]));
  const entries: { path: string; links: Record<string, string>; lastmod?: string }[] = [];
  for (const sitemap of sitemaps) {
    const xml = await (await request.get(sitemap)).text();
    for (const [, body] of xml.matchAll(/<url>(.*?)<\/url>/g)) {
      const links = Object.fromEntries(
        [...body.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(([, lang, href]) => [lang, href]),
      );
      entries.push({
        path: local(body.match(/<loc>([^<]+)<\/loc>/)![1]),
        links,
        lastmod: body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
      });
    }
  }
  return entries;
}

const meta = (page: Page, selector: string) => page.locator(selector).getAttribute('content');

test.describe('sitemap', () => {
  test('lists the 12 localised URLs with FR, EN, x-default alternates and lastmod', async ({ request }) => {
    const entries = await sitemapEntries(request);
    expect(entries).toHaveLength(12);
    for (const { path, links, lastmod } of entries) {
      expect(Object.keys(links).sort(), path).toEqual(['en', 'fr', 'x-default']);
      expect(links['x-default'], path).toBe(links.fr);
      expect(links[path.startsWith('/en/') ? 'en' : 'fr'], path).toBe(`${SITE}${path}`);
      expect(lastmod, path).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  });

  test('alternates agree with each page’s own hreflang links', async ({ page, request }) => {
    for (const { path, links } of await sitemapEntries(request)) {
      await page.goto(path);
      for (const lang of ['fr', 'en', 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`), `${path} ${lang}`).toHaveAttribute(
          'href',
          links[lang],
        );
      }
    }
  });

  test('is announced in robots.txt', async ({ request }) => {
    expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
  });
});

test.describe('page metadata', () => {
  test('every page has a unique description and an og:image that exists', async ({ page, request }) => {
    const paths = [...(await sitemapEntries(request)).map((e) => e.path), '/404.html'];
    const descriptions = new Map<string, string>();

    for (const path of paths) {
      await page.goto(path);

      const description = (await meta(page, 'meta[name="description"]'))!;
      expect(descriptions.get(description), `${path} reuses the description of`).toBeUndefined();
      descriptions.set(description, path);

      const image = (await meta(page, 'meta[property="og:image"]'))!;
      expect(image, path).toMatch(/^https:\/\/johannlaqua\.com\/og\/.+\.png$/);
      expect(await meta(page, 'meta[name="twitter:image"]'), path).toBe(image);
      expect(await meta(page, 'meta[property="og:image:alt"]'), path).toBeTruthy();
      expect(await meta(page, 'meta[name="twitter:card"]'), path).toBe('summary_large_image');

      const response = await request.get(local(image));
      expect(response.status(), `${path} → ${image}`).toBe(200);
      expect(response.headers()['content-type'], image).toContain('image/png');
    }
  });

  test('declares its locale and the alternate one', async ({ page }) => {
    await page.goto('/');
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('fr_FR');
    expect(await meta(page, 'meta[property="og:locale:alternate"]')).toBe('en_US');
    await page.goto('/en/');
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('en_US');
    expect(await meta(page, 'meta[property="og:locale:alternate"]')).toBe('fr_FR');
  });

  test('lets search engines use large previews on indexable pages only', async ({ page }) => {
    await page.goto('/');
    expect(await meta(page, 'meta[name="robots"]')).toBe(
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    await page.goto('/404.html');
    expect(await meta(page, 'meta[name="robots"]')).toBe('noindex');
  });
});

test.describe('structured data', () => {
  const graph = async (page: Page) =>
    JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)['@graph'] as Record<
      string,
      any
    >[];
  const node = (nodes: Record<string, any>[], type: string) => nodes.find((n) => n['@type'] === type);

  test('the home page describes its owner and the site', async ({ page }) => {
    await page.goto('/en/');
    const nodes = await graph(page);
    expect(node(nodes, 'Person')).toMatchObject({ name: 'Johann Laqua', url: `${SITE}/` });
    expect(node(nodes, 'Person')!.sameAs.length).toBeGreaterThan(0);
    expect(node(nodes, 'WebSite')).toMatchObject({ inLanguage: 'en', url: `${SITE}/` });
    expect(node(nodes, 'BlogPosting')).toBeUndefined();
  });

  test('a post is a complete BlogPosting with a breadcrumb', async ({ page }) => {
    const path = '/blog/penser-comme-un-attaquant/';
    await page.goto(path);
    const nodes = await graph(page);

    const post = node(nodes, 'BlogPosting')!;
    expect(post).toMatchObject({
      headline: 'Penser comme un attaquant quand on écrit du code',
      inLanguage: 'fr',
      image: `${SITE}/og/blog/penser-comme-un-attaquant.png`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${path}` },
      author: { '@type': 'Person', name: 'Johann Laqua' },
      publisher: { '@type': 'Person', name: 'Johann Laqua' },
    });
    expect(post.datePublished).toMatch(/^2026-04-03T/);
    expect(post.dateModified).toBeTruthy();

    const crumbs = node(nodes, 'BreadcrumbList')!.itemListElement;
    expect(crumbs.map((c: any) => [c.position, c.item])).toEqual([
      [1, `${SITE}/`],
      [2, `${SITE}/blog/`],
      [3, `${SITE}${path}`],
    ]);
  });
});

test.describe('feeds', () => {
  for (const { home, feed, lang, post } of [
    { home: '/', feed: '/rss.xml', lang: 'fr', post: '/blog/penser-comme-un-attaquant/' },
    { home: '/en/', feed: '/en/rss.xml', lang: 'en', post: '/en/blog/thinking-like-an-attacker/' },
  ]) {
    test(`${feed} is discoverable and lists the ${lang.toUpperCase()} posts`, async ({ page, request }) => {
      await page.goto(home);
      await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
        'href',
        `${SITE}${feed}`,
      );

      const response = await request.get(feed);
      expect(response.status()).toBe(200);
      const xml = await response.text();
      expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?><rss version="2.0"/);
      expect(xml).toContain(`<language>${lang}</language>`);
      expect(xml).toContain(`<atom:link href="${SITE}${feed}" rel="self" type="application/rss+xml"/>`);
      expect(xml).toContain(`<link>${SITE}${post}</link>`);
      // Only this locale's posts.
      expect(xml).not.toContain(lang === 'fr' ? '/en/blog/' : `${SITE}/blog/`);
    });
  }
});
