import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildSitemapMeta } from './src/lib/sitemap.ts';

const site = 'https://johannlaqua.com';
const sitemapMeta = buildSitemapMeta(fileURLToPath(new URL('./src/content/blog', import.meta.url)));

export default defineConfig({
  site,
  output: 'static',
  // Directory-style URLs everywhere (`/blog/x/`), matching what the static
  // build emits, so canonical, hreflang and internal links share one shape.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en' },
      },
      // Replace the shape-based pairing with the explicit one (translated
      // slugs), add `x-default` (the FR page) and `lastmod`.
      serialize(item) {
        const meta = sitemapMeta.get(new URL(item.url).pathname);
        if (!meta) return item;
        return {
          ...item,
          lastmod: meta.lastmod?.toISOString(),
          links: [
            { lang: 'fr', url: new URL(meta.fr, site).href },
            { lang: 'en', url: new URL(meta.en, site).href },
            { lang: 'x-default', url: new URL(meta.fr, site).href },
          ],
        };
      },
    }),
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  compressHTML: true,
  // The CSP (src/config/security.ts) only allows same-origin files, so nothing
  // may be inlined: no <style> tags (style-src 'self') and no data: fonts
  // (font-src 'self') — Vite would otherwise inline the smallest font subsets.
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
