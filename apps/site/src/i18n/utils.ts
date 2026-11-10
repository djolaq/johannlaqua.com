import { ui, defaultLocale, locales, type Locale, type UiKey } from './ui';

export { locales, defaultLocale };
export type { Locale };

export function getLangFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if (locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/** Prefix a path with the locale, except for the default locale (which lives at the root). */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/** Given the current locale and pathname, return the equivalent path in the other locale. */
export function getAlternateLocalePath(currentLocale: Locale, pathname: string): { locale: Locale; path: string } {
  const otherLocale = locales.find((l) => l !== currentLocale)!;
  let rest = pathname;
  if (currentLocale !== defaultLocale) {
    rest = pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
  }
  return { locale: otherLocale, path: localizePath(otherLocale, rest) };
}
