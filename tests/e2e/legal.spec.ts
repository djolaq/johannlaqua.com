import { expect, test } from '@playwright/test';

const pages = [
  { path: '/mentions-legales', lang: 'fr', heading: 'Mentions légales' },
  { path: '/confidentialite', lang: 'fr', heading: 'Politique de confidentialité' },
  { path: '/en/legal-notice', lang: 'en', heading: 'Legal notice' },
  { path: '/en/privacy', lang: 'en', heading: 'Privacy policy' },
];

test.describe('legal pages', () => {
  for (const { path, lang, heading } of pages) {
    test(`${path} renders in ${lang}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    });
  }

  test('footer links to the legal pages in each locale', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute('href', '/mentions-legales');
    await expect(footer.getByRole('link', { name: 'Confidentialité' })).toHaveAttribute('href', '/confidentialite');

    await page.goto('/en/');
    await expect(footer.getByRole('link', { name: 'Legal notice' })).toHaveAttribute('href', '/en/legal-notice');
    await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/en/privacy');
  });

  test('language toggle switches between FR and EN legal notice', async ({ page }) => {
    await page.goto('/mentions-legales');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/legal-notice$/);
  });
});
