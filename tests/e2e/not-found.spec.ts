import { expect, test } from '@playwright/test';

test.describe('404 page', () => {
  test('returns a 404 status for an unknown route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    expect(response?.status()).toBe(404);
  });

  test('shows bilingual content with working home links', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page).toHaveTitle(/Johann Laqua/);

    await expect(page.getByRole('heading', { name: 'Page introuvable' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

    await expect(page.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute(
      'href',
      '/',
    );
    await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/en/',
    );
  });
});
