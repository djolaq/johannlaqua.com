// RSS 2.0 feed of one locale's published posts (`/rss.xml`, `/en/rss.xml`).
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { localizePath, useTranslations, type Locale } from '../i18n/utils';
import { email, name } from '../config/site';

export async function blogFeed(locale: Locale, site: URL): Promise<Response> {
  const t = useTranslations(locale);
  const posts = (await getCollection('blog', ({ id, data }) => id.startsWith(`${locale}/`) && !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const selfUrl = new URL(localizePath(locale, '/rss.xml'), site).href;

  return rss({
    title: t('blog.feedTitle'),
    description: t('blog.subtitle'),
    // Channel <link>: the blog index of this locale (item links are absolute paths).
    site: new URL(localizePath(locale, '/blog'), site).href,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    // `atom:link rel="self"` is what the W3C validator asks every RSS feed for.
    customData: [
      `<language>${locale}</language>`,
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>`,
      ...(posts[0] ? [`<lastBuildDate>${posts[0].data.date.toUTCString()}</lastBuildDate>`] : []),
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: localizePath(locale, `/blog/${post.id.replace(`${locale}/`, '')}`),
      categories: post.data.tags,
      author: `${email} (${name})`,
    })),
  });
}
