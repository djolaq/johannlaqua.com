import { expect, test } from '@playwright/test';

test('switches from French to English and back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('link', { name: 'FR' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('keeps the same article when switching language from a blog post', async ({ page }) => {
  await page.goto('/blog/penser-comme-un-attaquant/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en\/blog\/thinking-like-an-attacker\/?$/);
});
