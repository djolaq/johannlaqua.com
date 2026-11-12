// Pure blog logic: no `astro:content` import, so it is unit-testable with
// plain objects. Pages and layouts fetch the collection and pass it in.
import { localizePath, locales, type Locale } from '../i18n/utils';

/** The subset of a `blog` collection entry these helpers need. */
export interface PostLike {
  id: string;
  data: {
    title: string;
    date: Date;
    tags: string[];
    draft: boolean;
    translationId: string;
  };
}

export function otherLocale(locale: Locale): Locale {
  return locales.find((l) => l !== locale)!;
}

/** Slug of a post: its id without the `<locale>/` folder prefix. */
export function postSlug(post: PostLike): string {
  return post.id.slice(post.id.indexOf('/') + 1);
}

export function postLocale(post: PostLike): Locale {
  return post.id.slice(0, post.id.indexOf('/')) as Locale;
}

export function postPath(post: PostLike): string {
  return localizePath(postLocale(post), `/blog/${postSlug(post)}`);
}

export function tagPath(locale: Locale, tag: string): string {
  return localizePath(locale, `/blog/tags/${tag}`);
}

/** Published posts of one locale, newest first. */
export function publishedPosts<T extends PostLike>(posts: readonly T[], locale: Locale): T[] {
  return posts
    .filter((p) => postLocale(p) === locale && !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Every tag used by the published posts of one locale, alphabetical. */
export function tagsOf(posts: readonly PostLike[], locale: Locale): string[] {
  const tags = new Set(publishedPosts(posts, locale).flatMap((p) => p.data.tags));
  return [...tags].sort((a, b) => a.localeCompare(b, locale));
}

/**
 * Older and newer neighbours of a post within its locale. `previous` is the
 * older post, `next` the newer one; either is undefined at the ends.
 */
export function adjacentPosts<T extends PostLike>(
  posts: readonly T[],
  current: PostLike,
): { previous?: T; next?: T } {
  const list = publishedPosts(posts, postLocale(current));
  const index = list.findIndex((p) => p.id === current.id);
  if (index === -1) return {};
  return { previous: list[index + 1], next: list[index - 1] };
}

/**
 * Other posts of the same locale sharing at least one tag, most shared tags
 * first, then newest. Empty when nothing matches.
 */
export function relatedPosts<T extends PostLike>(posts: readonly T[], current: PostLike, limit = 3): T[] {
  const tags = new Set(current.data.tags);
  return publishedPosts(posts, postLocale(current))
    .filter((p) => p.id !== current.id)
    .map((post) => ({ post, shared: post.data.tags.filter((tag) => tags.has(tag)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

/** The published translation of a post in the other locale, if any. */
export function counterpartOf<T extends PostLike>(posts: readonly T[], current: PostLike): T | undefined {
  const target = otherLocale(postLocale(current));
  return posts.find(
    (p) => postLocale(p) === target && !p.data.draft && p.data.translationId === current.data.translationId,
  );
}

/**
 * Tags are written per locale (`securite` / `security`), so a tag page's
 * translation is inferred from the translated posts: tags are paired by their
 * position in the two `tags` arrays (the convention is to keep the same order
 * on both sides). A tag is only paired when every translated post agrees on
 * the same counterpart; otherwise it has none and callers fall back to the
 * other locale's blog index.
 */
export function tagCounterpart(posts: readonly PostLike[], locale: Locale, tag: string): string | undefined {
  const candidates = new Set<string | undefined>();
  for (const post of publishedPosts(posts, locale)) {
    const index = post.data.tags.indexOf(tag);
    if (index === -1) continue;
    const translation = counterpartOf(posts, post);
    if (!translation) continue;
    candidates.add(translation.data.tags[index]);
  }
  if (candidates.size !== 1) return undefined;
  return [...candidates][0];
}
