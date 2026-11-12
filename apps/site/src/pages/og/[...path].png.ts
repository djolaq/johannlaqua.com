// One social image per page, rendered at build time (see lib/og-image.ts).
// The path mirrors the page's: `/en/blog/x/` → `/og/en/blog/x.png` (`ogImagePath`).
// An e2e test checks that every page's `og:image` resolves, so a new page
// that is not listed here fails CI instead of shipping a broken preview.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage, type OgCard } from '../../lib/og-image';
import { locales, localizePath, ogImagePath, useTranslations } from '../../i18n/utils';
import { name } from '../../config/site';

export async function getStaticPaths() {
  const cards: { pathname: string; card: OgCard }[] = [];

  for (const locale of locales) {
    const t = useTranslations(locale);
    cards.push(
      {
        pathname: localizePath(locale, '/'),
        card: { kicker: name, title: t('site.role'), description: t('site.description') },
      },
      {
        pathname: localizePath(locale, '/blog'),
        card: { kicker: name, title: t('blog.pageTitle'), description: t('blog.subtitle') },
      },
      {
        pathname: localizePath(locale, locale === 'fr' ? '/mentions-legales' : '/legal-notice'),
        card: { kicker: t('legal.eyebrow'), title: t('legal.notice.title'), description: t('legal.notice.description') },
      },
      {
        pathname: localizePath(locale, locale === 'fr' ? '/confidentialite' : '/privacy'),
        card: { kicker: t('legal.eyebrow'), title: t('legal.privacy.title'), description: t('legal.privacy.description') },
      },
    );

    const posts = await getCollection('blog', ({ id, data }) => id.startsWith(`${locale}/`) && !data.draft);
    for (const post of posts) {
      const date = post.data.date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      cards.push({
        pathname: localizePath(locale, `/blog/${post.id.replace(`${locale}/`, '')}`),
        card: { kicker: `${t('blog.eyebrow')} · ${date}`, title: post.data.title, description: post.data.description },
      });
    }
  }

  return cards.map(({ pathname, card }) => ({
    params: { path: ogImagePath(pathname).replace(/^\/og\/|\.png$/g, '') },
    props: card,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOgImage(props as OgCard)), { headers: { 'Content-Type': 'image/png' } });
