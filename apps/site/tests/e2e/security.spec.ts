import { expect, test, type APIRequestContext } from '@playwright/test';

/** Every built page: the sitemap, plus the 404 (which the sitemap leaves out). */
async function allPagePaths(request: APIRequestContext): Promise<string[]> {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const paths: string[] = [];
  for (const sitemap of sitemaps) {
    const xml = await (await request.get(sitemap)).text();
    paths.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  }
  return [...paths, '/this-page-does-not-exist/'];
}

test.describe('Security & privacy', () => {
  test('every page loads only same-origin resources and violates no CSP rule', async ({
    page,
    request,
    baseURL,
  }) => {
    const paths = await allPagePaths(request);
    expect(paths.length).toBeGreaterThan(5);

    const origin = new URL(baseURL!).origin;
    const external: string[] = [];
    const violations: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.protocol !== 'data:' && url.origin !== origin) external.push(`${page.url()} → ${req.url()}`);
    });
    page.on('console', (msg) => {
      if (/Content[- ]Security[- ]Policy/i.test(msg.text())) violations.push(`${page.url()}: ${msg.text().slice(0, 160)}`);
    });

    for (const path of paths) {
      await page.goto(path, { waitUntil: 'load' });
      await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute(
        'content',
        /default-src 'none'.*script-src 'none'/,
      );
    }

    // The privacy policy promises no third-party request: this keeps it true.
    expect(external).toEqual([]);
    expect(violations).toEqual([]);
  });

  test('pages are styled with the CSP active (no stylesheet blocked)', async ({ page }) => {
    await page.goto('/');

    const sheets = await page.evaluate(() => document.styleSheets.length);
    expect(sheets).toBeGreaterThan(0);
    await expect(page.locator('body')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });

  test('publishes a valid security.txt (RFC 9116)', async ({ request }) => {
    const response = await request.get('/.well-known/security.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^text\/plain/);

    const fields = new Map<string, string[]>();
    for (const line of (await response.text()).split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue;
      const match = line.match(/^([A-Za-z-]+):\s*(.+)$/);
      expect(match, `malformed line: ${line}`).not.toBeNull();
      const [, key, value] = match!;
      fields.set(key, [...(fields.get(key) ?? []), value]);
    }

    expect(fields.get('Contact')).toEqual(['mailto:johann@laqua.fr']);
    expect(fields.get('Preferred-Languages')).toEqual(['fr, en']);
    expect(fields.get('Expires')).toHaveLength(1);

    // RFC 9116 asks for an expiry less than a year away; fail a month ahead
    // so the file gets renewed before it goes stale.
    const expires = Date.parse(fields.get('Expires')![0]);
    const day = 24 * 60 * 60 * 1000;
    expect(expires - Date.now()).toBeGreaterThan(30 * day);
    expect(expires - Date.now()).toBeLessThan(366 * day);
  });
});
