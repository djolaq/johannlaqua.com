import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fontFamilies } from '@johannlaqua/design-system/fonts';

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
  // CSS inlined in every page: no render-blocking request (ADR 0004).
  build: { inlineStylesheets: 'always' },
  // Self-hosted fonts declared by the design system (latin woff2 from its
  // pinned @fontsource packages), rendered by <Font> in BaseLayout. The
  // `local` provider reads node_modules: no network at build time.
  // No `prefetch`: it would ship client JS (ADR 0004).
  fonts: fontFamilies.map(({ variants, ...family }) => ({
    ...family,
    provider: fontProviders.local(),
    options: { variants },
  })),
});
