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
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#lab')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('hero has no photo and loads no external image', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero img')).toHaveCount(0);
    await expect(page.locator('.hero .field svg')).toBeAttached();
  });

  test('contact CTA points to the contact mailbox', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.locator('#contact a[href^="mailto:"]');
    await expect(contactLink).toHaveAttribute('href', 'mailto:johann@laqua.fr');
  });
});

test.describe('Skills showcase', () => {
  for (const path of ['/', '/en/']) {
    test(`presents skills rather than services (${path})`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('#services')).toHaveCount(0);
      await expect(page.locator('#skills article')).toHaveCount(3);
      await expect(page.locator('#skills')).toContainText('Red team');
      await expect(page.locator('#skills')).toContainText('Blue team');
    });

    test(`lab links to the public repositories and opens them safely (${path})`, async ({ page }) => {
      await page.goto(path);

      const links = page.locator('#lab a[target="_blank"]');
      await expect(links).toHaveCount(3);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/djolaq\//);
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  test('hero primary call to action points to the skills section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero a').first()).toHaveAttribute('href', '/#skills');
  });
});

test.describe('Home page (en)', () => {
  test('loads with the English locale', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Narrow viewport (320px)', () => {
  for (const path of ['/', '/en/', '/blog/', '/blog/penser-comme-un-attaquant/']) {
    test(`does not scroll horizontally (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(path);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }

  test('keeps the hero stats on their own column', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');

    const boxes = await page.locator('.stat__value').evaluateAll((els) =>
      els.map((el) => {
        const { left, right } = el.getBoundingClientRect();
        return { left, right };
      }),
    );
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].left).toBeGreaterThanOrEqual(boxes[i - 1].right);
    }
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
      expect(data['@context']).toBe('https://schema.org');
      const person = data['@graph'].find((node: { '@type': string }) => node['@type'] === 'Person');
      expect(person).toMatchObject({
        '@type': 'Person',
        name: 'Johann Laqua',
        url: 'https://johannlaqua.com/',
        sameAs: ['https://github.com/djolaq', 'https://www.linkedin.com/in/johannlaqua/'],
      });
    });
  }
});
