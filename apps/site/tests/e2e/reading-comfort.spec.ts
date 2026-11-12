import { expect, test } from '@playwright/test';

test.describe('external links', () => {
  for (const { path, hint } of [
    { path: '/', hint: '(s’ouvre dans un nouvel onglet)' },
    { path: '/en/', hint: '(opens in a new tab)' },
    { path: '/confidentialite/', hint: '(s’ouvre dans un nouvel onglet)' },
  ]) {
    test(`${path}: every new-tab link shows ↗ and announces it`, async ({ page }) => {
      await page.goto(path);
      const links = page.locator('a[target="_blank"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        await expect(link.locator('[aria-hidden="true"]')).toHaveText('↗');
        await expect(link.locator('.visually-hidden')).toHaveText(hint);
        await expect(link).toHaveAttribute('rel', /noopener/);
      }
    });
  }

  test('profile links keep rel="me" and get an accessible name with the hint', async ({ page }) => {
    await page.goto('/en/');
    const github = page.locator('footer').getByRole('link', { name: 'GitHub (opens in a new tab)' });
    await expect(github).toHaveAttribute('rel', 'me noopener noreferrer');
  });
});

test.describe('print', () => {
  for (const path of ['/blog/penser-comme-un-attaquant/', '/en/legal-notice/']) {
    test(`${path} prints black on white without the site chrome`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ media: 'print' });

      for (const selector of ['header.header', 'footer.footer', '.skip-link', '.breadcrumb', '.post__nav', '.announce']) {
        const el = page.locator(selector);
        if ((await el.count()) > 0) await expect(el.first()).toBeHidden();
      }

      const colors = await page.evaluate(() => {
        const body = getComputedStyle(document.body);
        const h1 = getComputedStyle(document.querySelector('h1')!);
        return { background: body.backgroundColor, text: h1.color };
      });
      expect(colors.text).toBe('rgb(0, 0, 0)');
      expect(['rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)']).toContain(colors.background);
      const html = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
      expect(html).toBe('rgb(255, 255, 255)');

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});
