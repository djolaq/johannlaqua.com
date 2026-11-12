import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://johannlaqua.com',
  output: 'static',
  integrations: [sitemap()],
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
