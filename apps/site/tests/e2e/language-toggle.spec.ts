import { expect, test } from '@playwright/test';

// The switch lists both languages; clicking means following the one that is
// not the current page.
const langToggle = (page: import('@playwright/test').Page) =>
  page.locator('.lang-switch a:not([aria-current])');

test('switches from French to English and back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await langToggle(page).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await langToggle(page).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('keeps the same article when switching language from a blog post', async ({ page }) => {
  await page.goto('/blog/penser-comme-un-attaquant/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await langToggle(page).click();
  await expect(page).toHaveURL(/\/en\/blog\/thinking-like-an-attacker\/?$/);
});
