import { expect, test } from '@playwright/test';

test.describe('Home page (fr)', () => {
  test('loads with the expected language, title and hero content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page).toHaveTitle(/Johann Laqua/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('exposes the main sections via anchor navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#services')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('contact CTA points to the contact mailbox', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.locator('#contact a[href^="mailto:"]');
    await expect(contactLink).toHaveAttribute('href', 'mailto:johann@laqua.fr');
  });
});

test.describe('Home page (en)', () => {
  test('loads with the English locale', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
