import { describe, expect, it } from 'vitest';
import {
  formatDate,
  getAlternateLocalePath,
  isoDate,
  getLangFromUrl,
  localizePath,
  ogImagePath,
  ogLocale,
  useTranslations,
} from '../../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns the default locale (fr) for the root path', () => {
    expect(getLangFromUrl(new URL('https://johannlaqua.com/'))).toBe('fr');
  });

  it('returns the default locale for unprefixed paths', () => {
    expect(getLangFromUrl(new URL('https://johannlaqua.com/blog/foo'))).toBe('fr');
  });

  it('returns "en" for paths prefixed with /en', () => {
    expect(getLangFromUrl(new URL('https://johannlaqua.com/en/'))).toBe('en');
    expect(getLangFromUrl(new URL('https://johannlaqua.com/en/blog/foo'))).toBe('en');
  });
});

describe('localizePath', () => {
  it('leaves the path untouched for the default locale', () => {
    expect(localizePath('fr', '/blog')).toBe('/blog/');
    expect(localizePath('fr', 'blog')).toBe('/blog/');
  });

  it('prefixes the path with the locale for non-default locales', () => {
    expect(localizePath('en', '/blog')).toBe('/en/blog/');
    expect(localizePath('en', '/')).toBe('/en/');
  });

  it('adds the trailing slash Astro uses for its built URLs', () => {
    expect(localizePath('fr', '/blog/mon-article')).toBe('/blog/mon-article/');
    expect(localizePath('en', '/blog/my-post')).toBe('/en/blog/my-post/');
  });

  it('does not add a slash to file-like paths', () => {
    expect(localizePath('fr', '/rss.xml')).toBe('/rss.xml');
    expect(localizePath('en', '/rss.xml')).toBe('/en/rss.xml');
  });

  it('keeps a hash or query suffix out of the slash logic', () => {
    expect(localizePath('fr', '/#skills')).toBe('/#skills');
    expect(localizePath('en', '/blog?page=2')).toBe('/en/blog/?page=2');
  });
});

describe('getAlternateLocalePath', () => {
  it('switches from fr to en and prefixes the path', () => {
    expect(getAlternateLocalePath('fr', '/blog/mon-article/')).toEqual({
      locale: 'en',
      path: '/en/blog/mon-article/',
    });
  });

  it('switches from en to fr and strips the /en prefix', () => {
    expect(getAlternateLocalePath('en', '/en/blog/my-post/')).toEqual({
      locale: 'fr',
      path: '/blog/my-post/',
    });
  });

  it('handles the homepage in both directions', () => {
    expect(getAlternateLocalePath('fr', '/')).toEqual({ locale: 'en', path: '/en/' });
    expect(getAlternateLocalePath('en', '/en/')).toEqual({ locale: 'fr', path: '/' });
  });

  it('produces the same shape as the canonical URL (trailing slash included)', () => {
    expect(getAlternateLocalePath('fr', '/blog/mon-article/').path).toBe('/en/blog/mon-article/');
    expect(getAlternateLocalePath('en', '/blog/my-post/').path).toBe('/blog/my-post/');
  });
});

describe('useTranslations', () => {
  it('resolves known keys for each locale', () => {
    const tFr = useTranslations('fr');
    const tEn = useTranslations('en');

    expect(tFr('nav.contact')).toBe('Contact');
    expect(tEn('nav.about')).toBe('About');
    expect(tFr('nav.about')).not.toBe(tEn('nav.about'));
  });
});

describe('ogImagePath', () => {
  it('mirrors the page path under /og/', () => {
    expect(ogImagePath('/')).toBe('/og/index.png');
    expect(ogImagePath('/en/')).toBe('/og/en.png');
    expect(ogImagePath('/blog/')).toBe('/og/blog.png');
    expect(ogImagePath('/en/blog/thinking-like-an-attacker/')).toBe('/og/en/blog/thinking-like-an-attacker.png');
  });

  it('does not depend on the trailing slash', () => {
    expect(ogImagePath('/mentions-legales')).toBe(ogImagePath('/mentions-legales/'));
  });
});

describe('ogLocale', () => {
  it('maps site locales to Open Graph locales', () => {
    expect(ogLocale('fr')).toBe('fr_FR');
    expect(ogLocale('en')).toBe('en_US');
  });
});

describe('formatDate / isoDate', () => {
  const date = new Date('2026-06-12');

  it('formats a calendar date per locale', () => {
    expect(formatDate(date, 'fr')).toBe('12 juin 2026');
    expect(formatDate(date, 'en')).toBe('12 June 2026');
  });

  it('does not shift the day with the build machine time zone', () => {
    // UTC midnight is still the 11th in any zone west of Greenwich.
    expect(formatDate(new Date('2026-01-01'), 'en')).toBe('1 January 2026');
  });

  it('emits a date-only datetime value', () => {
    expect(isoDate(date)).toBe('2026-06-12');
  });
});
