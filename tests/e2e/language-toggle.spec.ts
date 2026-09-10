import { expect, test } from '@playwright/test';

// Targeted by class rather than accessible name: the toggle's aria-label
// ("Switch language to EN/FR") makes role/name locators match ambiguously
// (substring matching also catches the skip link and blog card links).
const langToggle = (page: import('@playwright/test').Page) => page.locator('a.lang-toggle');

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
