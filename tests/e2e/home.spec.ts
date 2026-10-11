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

test.describe('Social links', () => {
  const profiles = ['https://github.com/djolaq', 'https://www.linkedin.com/in/johannlaqua/'];

  for (const path of ['/', '/en/']) {
    test(`point to the real profiles and open safely, with rel=me (${path})`, async ({ page }) => {
      await page.goto(path);

      for (const scope of ['#contact', 'footer']) {
        const links = page.locator(`${scope} a[target="_blank"]`);
        await expect(links).toHaveCount(profiles.length);

        for (const [i, href] of profiles.entries()) {
          await expect(links.nth(i)).toHaveAttribute('href', href);
          await expect(links.nth(i)).toHaveAttribute('rel', 'me noopener noreferrer');
        }
      }
    });
  }
});

test.describe('Structured data', () => {
  for (const path of ['/', '/en/']) {
    test(`exposes a schema.org Person linked to the social profiles (${path})`, async ({ page }) => {
      await page.goto(path);

      const raw = await page.locator('script[type="application/ld+json"]').textContent();
      const data = JSON.parse(raw ?? '');
      expect(data).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Johann Laqua',
        url: 'https://johannlaqua.com/',
        sameAs: ['https://github.com/djolaq', 'https://www.linkedin.com/in/johannlaqua/'],
      });
    });
  }
});
