import { describe, expect, it } from 'vitest';
import {
  getAlternateLocalePath,
  getLangFromUrl,
  localizePath,
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
