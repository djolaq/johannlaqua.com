// One social image per page, rendered at build time (see lib/og-image.ts).
// The path mirrors the page's: `/en/blog/x/` → `/og/en/blog/x.png` (`ogImagePath`).
// An e2e test checks that every page's `og:image` resolves, so a new page
// that is not listed here fails CI instead of shipping a broken preview.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage, type OgCard } from '../../lib/og-image';
import { formatDate, locales, localizePath, ogImagePath, useTranslations } from '../../i18n/utils';
import { postPath, publishedPosts, tagPath, tagsOf } from '../../lib/blog';
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

    const allPosts = await getCollection('blog');
    for (const post of publishedPosts(allPosts, locale)) {
      cards.push({
        pathname: postPath(post),
        card: {
          kicker: `${t('blog.eyebrow')} · ${formatDate(post.data.date, locale)}`,
          title: post.data.title,
          description: post.data.description,
        },
      });
    }
    for (const tag of tagsOf(allPosts, locale)) {
      cards.push({
        pathname: tagPath(locale, tag),
        card: {
          kicker: t('blog.eyebrow'),
          title: t('blog.tag.pageTitle').replace('{tag}', `#${tag}`),
          description: t('blog.tag.description').replace('{tag}', `#${tag}`),
        },
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
