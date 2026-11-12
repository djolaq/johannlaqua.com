import { expect, test } from '@playwright/test';

// Loading properties decided in ADR 0004. The byte limits themselves are
// checked on the build by scripts/size-budget.mjs; this checks the browser
// side: what is requested, which fonts render, whether the layout moves.

for (const path of ['/', '/en/']) {
  test.describe(`Page loading (${path})`, () => {
    test('has no render-blocking stylesheet and preloads the headline fonts', async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
      const preloads = page.locator('link[rel="preload"][as="font"][type="font/woff2"][crossorigin]');
      await expect(preloads).toHaveCount(2);
    });

    test('loads only same-origin woff2 fonts and renders with them', async ({ page, baseURL }) => {
      const fontRequests: string[] = [];
      page.on('request', (request) => {
        if (request.resourceType() === 'font') fontRequests.push(request.url());
      });

      await page.goto(path);
      const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.style}`);
      });

      expect(fontRequests.length).toBeGreaterThan(0);
      for (const url of fontRequests) {
        expect(new URL(url).origin).toBe(new URL(baseURL!).origin);
        expect(url).toMatch(/\/_astro\/fonts\/[^/]+\.woff2$/);
      }
      expect(loaded.some((f) => f.startsWith('Geist') && f.endsWith('normal'))).toBe(true);
      expect(loaded.some((f) => f.startsWith('Instrument Serif') && f.endsWith('italic'))).toBe(true);
    });

    test('does not shift the layout when the fonts swap in', async ({ page }) => {
      // Hold the fonts back so the page first paints with the fallbacks, as
      // on a slow connection: the swap must not move anything.
      await page.route('**/_astro/fonts/*', async (route) => {
        await new Promise((r) => setTimeout(r, 600));
        await route.continue();
      });
      await page.goto(path, { waitUntil: 'load' });
      const cls = await page.evaluate(async () => {
        await document.fonts.ready;
        return new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(total), 500);
        });
      });

      // Metric-matched fallbacks keep every line box the same height; what is
      // left is a few pixels of horizontal drift on centred text
      // (~0.0002–0.0008), which Lighthouse reports as 0. A real regression (an
      // image or SVG without dimensions, a fallback without metrics) is
      // orders of magnitude larger.
      expect(cls).toBeLessThan(0.005);
    });
  });
}
