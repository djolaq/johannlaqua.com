import { expect, test } from '@playwright/test';

/**
 * Zero client JavaScript is a promise of this site (privacy policy, "no
 * tracker", `lab.site.body`). Only an inline JSON-LD block is allowed: any
 * `<script src>` or module script would mean a bundler entry point slipped in.
 */
const PAGES = [
  '/',
  '/en/',
  '/blog',
  '/en/blog',
  '/blog/ia-boosted-dev-sans-dette',
  '/en/blog/ai-boosted-dev-without-debt',
  '/mentions-legales',
  '/en/legal-notice',
  '/confidentialite',
  '/en/privacy',
];

for (const path of PAGES) {
  test(`ships no client JavaScript (${path})`, async ({ page }) => {
    await page.goto(path);

    // Guards against a silent 404: the page under test must really be there.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await expect(page.locator('script[src]')).toHaveCount(0);
    await expect(page.locator('script[type="module"]')).toHaveCount(0);
    await expect(page.locator('link[rel="modulepreload"]')).toHaveCount(0);
  });
}
