import { expect, test } from '@playwright/test';

test.describe('404 page', () => {
  test('returns a 404 status for an unknown route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');

    expect(response?.status()).toBe(404);
  });

  test('shows bilingual content with working home links', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/');

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

  test('is not indexable and declares no canonical URL', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/');

    // The same file answers every unknown path: it must never be indexed,
    // and a canonical/hreflang pair would point at a page that does not exist.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });

  test('has a single h1', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
});
