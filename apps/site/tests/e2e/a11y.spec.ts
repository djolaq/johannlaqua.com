import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Accessibility regression suite (WCAG 2.2 AA). Every page type, in both
 * locales. The 404 is a single bilingual file, reached from either tree.
 */
const pages = [
  { path: '/', label: 'home (fr)' },
  { path: '/en/', label: 'home (en)' },
  { path: '/blog/', label: 'blog index (fr)' },
  { path: '/en/blog/', label: 'blog index (en)' },
  { path: '/blog/penser-comme-un-attaquant/', label: 'post (fr)' },
  { path: '/en/blog/thinking-like-an-attacker/', label: 'post (en)' },
  { path: '/mentions-legales/', label: 'legal notice (fr)' },
  { path: '/en/legal-notice/', label: 'legal notice (en)' },
  { path: '/confidentialite/', label: 'privacy (fr)' },
  { path: '/en/privacy/', label: 'privacy (en)' },
  { path: '/page-introuvable/', label: '404 (fr)' },
  { path: '/en/page-not-found/', label: '404 (en)' },
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** Minimum target size, WCAG 2.2 SC 2.5.8 (AA). */
const MIN_TARGET = 24;

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe('axe-core', () => {
  // Entrance animations start at opacity 0: scan the settled page.
  test.use({ reducedMotion: 'reduce' });

  for (const { path, label } of pages) {
    test(`has no violations: ${label}`, async ({ page }) => {
      await page.goto(path);

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const summary = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        targets: v.nodes.map((n) => n.target.join(' ')),
      }));
      expect(summary).toEqual([]);
    });
  }
});

test.describe('Target size (SC 2.5.8)', () => {
  for (const { path, label } of pages) {
    for (const width of [320, 1280]) {
      test(`every non-inline target is at least 24x24px at ${width}px: ${label}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);

        // Links inside running text are exempt (the "inline" exception).
        const undersized = await page.evaluate((min) => {
          const inline = (el: Element) => el.closest('p, .prose, td') !== null;
          return [...document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, summary')]
            .filter((el) => !inline(el) && el.getClientRects().length > 0)
            .filter((el) => !el.classList.contains('skip-link'))
            .map((el) => {
              const { width: w, height: h } = el.getBoundingClientRect();
              return { text: el.textContent?.trim().slice(0, 40), w: Math.round(w), h: Math.round(h) };
            })
            .filter(({ w, h }) => w < min || h < min);
        }, MIN_TARGET);
        expect(undersized).toEqual([]);
      });
    }
  }

  test('the skip link meets the size once revealed', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const box = await page.locator('.skip-link').boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(MIN_TARGET);
    expect(box?.height).toBeGreaterThanOrEqual(MIN_TARGET);
  });
});

test.describe('Current location', () => {
  test('marks the blog link as the current page on the blog index', async ({ page }) => {
    await page.goto('/blog/');
    const nav = page.locator('header nav');
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute('href', '/blog/');
    await expect(nav.locator('a[aria-current]')).toHaveCount(1);
  });

  test('marks the blog link as the current section on a post', async ({ page }) => {
    await page.goto('/en/blog/thinking-like-an-attacker/');
    const nav = page.locator('header nav');
    await expect(nav.locator('a[aria-current="true"]')).toHaveAttribute('href', '/en/blog/');
    await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
  });

  test('marks nothing as current on the home page (its links are in-page anchors)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header nav a[aria-current]')).toHaveCount(0);
  });

  test('marks the current legal page in the footer', async ({ page }) => {
    await page.goto('/confidentialite/');
    await expect(page.locator('footer a[aria-current="page"]')).toHaveAttribute('href', '/confidentialite/');
  });
});

test.describe('Language switch', () => {
  for (const { path, current, other, otherHref } of [
    { path: '/', current: 'fr', other: 'en', otherHref: '/en/' },
    { path: '/en/blog/thinking-like-an-attacker/', current: 'en', other: 'fr', otherHref: '/blog/penser-comme-un-attaquant/' },
  ]) {
    test(`exposes both languages, the current one marked (${path})`, async ({ page }) => {
      await page.goto(path);
      const group = page.locator('.lang-switch');

      const currentLink = group.locator(`a[hreflang="${current}"]`);
      await expect(currentLink).toHaveAttribute('aria-current', 'page');
      await expect(currentLink).toHaveAttribute('lang', current);

      const otherLink = group.locator(`a[hreflang="${other}"]`);
      await expect(otherLink).not.toHaveAttribute('aria-current', /.*/);
      await expect(otherLink).toHaveAttribute('lang', other);
      await expect(otherLink).toHaveAttribute('href', otherHref);
      // The visible code stays part of the accessible name (SC 2.5.3).
      await expect(otherLink).toHaveAccessibleName(new RegExp(`^${other.toUpperCase()}\\b`));
    });
  }

  test('labels the group in the page language', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.lang-switch')).toHaveAttribute('aria-label', 'Langue');
    await page.goto('/en/');
    await expect(page.locator('.lang-switch')).toHaveAttribute('aria-label', 'Language');
  });
});

test.describe('Skip link', () => {
  test('is the first focusable element and moves focus into <main>', async ({ page }) => {
    await page.goto('/blog/');

    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();

    // The next Tab lands on the first focusable element inside main, not back in the header.
    await page.keyboard.press('Tab');
    const inMain = await page.evaluate(() => document.querySelector('main')?.contains(document.activeElement));
    expect(inMain).toBe(true);
  });
});

test.describe('Decorative graphics', () => {
  for (const path of ['/', '/en/']) {
    test(`every svg is either hidden or named (${path})`, async ({ page }) => {
      await page.goto(path);

      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll('svg')]
          .filter((svg) => {
            const hidden = svg.closest('[aria-hidden="true"]') !== null;
            const named = svg.getAttribute('role') === 'img' && !!svg.getAttribute('aria-label');
            return !(hidden ? svg.getAttribute('focusable') === 'false' : named);
          })
          .map((svg) => svg.outerHTML.slice(0, 80)),
      );
      expect(offenders).toEqual([]);
    });
  }

  test('new-tab arrows are hidden and the new tab is announced', async ({ page }) => {
    await page.goto('/en/');
    const github = page.locator('footer a[href="https://github.com/djolaq"]');
    await expect(github).toHaveAccessibleName('GitHub (opens in a new tab)');
  });
});

test.describe('Keyboard walkthrough', () => {
  for (const path of ['/', '/en/blog/']) {
    test(`every focus stop shows an unclipped focus ring (${path})`, async ({ page }) => {
      await page.goto(path);
      const stops = await page.locator('a[href], button').count();

      const problems: string[] = [];
      const seen = new Set<string>();
      for (let i = 0; i < stops + 1; i++) {
        await page.keyboard.press('Tab');
        const result = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const style = getComputedStyle(el);
          const ring = parseFloat(style.outlineWidth) + Math.max(0, parseFloat(style.outlineOffset));
          const id = `${el.tagName} ${el.getAttribute('href') ?? ''} ${el.textContent?.trim().slice(0, 30)}`;
          if (style.outlineStyle === 'none' || parseFloat(style.outlineWidth) === 0) return { id, problem: 'no outline' };

          // The ring must not be cut by an ancestor that clips its overflow.
          const r = el.getBoundingClientRect();
          for (let a = el.parentElement; a; a = a.parentElement) {
            const { overflowX, overflowY } = getComputedStyle(a);
            if (overflowX === 'visible' && overflowY === 'visible') continue;
            if (a === document.documentElement || a === document.body) continue;
            const b = a.getBoundingClientRect();
            if (r.left - ring < b.left || r.right + ring > b.right || r.top - ring < b.top || r.bottom + ring > b.bottom) {
              return { id, problem: `ring clipped by .${a.className}` };
            }
          }
          return { id, problem: null };
        });
        if (!result || seen.has(result.id)) continue;
        seen.add(result.id);
        if (result.problem) problems.push(`${result.id}: ${result.problem}`);
      }
      expect(seen.size).toBeGreaterThan(5);
      expect(problems).toEqual([]);
    });
  }
});

test.describe('Reflow (SC 1.4.10)', () => {
  // 320px = 1280px at 400% zoom; 640x400 = 1280x800 at 200% zoom.
  for (const viewport of [
    { width: 320, height: 256 },
    { width: 640, height: 400 },
  ]) {
    for (const { path, label } of pages) {
      test(`no horizontal scroll at ${viewport.width}x${viewport.height}: ${label}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        expect(await horizontalOverflow(page)).toBe(0);
      });
    }
  }
});

test.describe('Header at narrow widths', () => {
  for (const width of [320, 360, 390, 430, 768]) {
    test(`the name, actions and nav never overlap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto('/blog/');

      const layout = await page.evaluate(() => {
        const brand = document.querySelector<HTMLElement>('.header__brand')!;
        const box = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        return {
          brandClipped: brand.scrollWidth > brand.clientWidth,
          brand: box('.header__brand'),
          actions: box('.header__actions'),
        };
      });
      expect(layout.brandClipped).toBe(false);
      const sameRow = layout.actions.top < layout.brand.bottom;
      if (sameRow) expect(layout.brand.right).toBeLessThanOrEqual(layout.actions.left);
    });
  }

  test('the wrapped mobile header stays under the anchor scroll offset', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/');
    const { header, offset } = await page.evaluate(() => ({
      header: document.querySelector('header.header')!.getBoundingClientRect().height,
      offset: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
    }));
    expect(header).toBeLessThan(offset);
  });
});

test.describe('User preferences', () => {
  test('prefers-contrast: more strengthens muted text and rules', async ({ page }) => {
    await page.goto('/');
    const read = () =>
      page.evaluate(() => {
        const s = getComputedStyle(document.body);
        return { muted: s.getPropertyValue('--text-muted').trim(), rule: s.getPropertyValue('--rule').trim() };
      });
    const normal = await read();
    await page.emulateMedia({ contrast: 'more' });
    const more = await read();
    expect(more.muted).not.toBe(normal.muted);
    expect(more.rule).not.toBe(normal.rule);
  });

  test('prefers-reduced-motion: reduce stops the animations and smooth scrolling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const motion = await page.evaluate(() => ({
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      path: parseFloat(getComputedStyle(document.querySelector('.field__path')!).animationDuration),
      pulse: getComputedStyle(document.querySelector('.hero__pulse')!, '::after').animationIterationCount,
    }));
    expect(motion.scroll).toBe('auto');
    expect(motion.path).toBeLessThan(0.01);
    expect(motion.pulse).toBe('1');
  });
});
