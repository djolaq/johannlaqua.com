import { describe, expect, it } from 'vitest';
import {
  adjacentPosts,
  counterpartOf,
  postPath,
  publishedPosts,
  relatedPosts,
  tagCounterpart,
  tagPath,
  tagsOf,
  type PostLike,
} from '../../src/lib/blog';

function post(id: string, date: string, tags: string[], translationId = id, draft = false): PostLike {
  return { id, data: { title: id, date: new Date(date), tags, draft, translationId } };
}

const posts: PostLike[] = [
  post('fr/a', '2026-01-01', ['securite', 'red-team'], 'a'),
  post('fr/b', '2026-02-01', ['ia', 'developpement'], 'b'),
  post('fr/c', '2026-03-01', ['securite', 'ia'], 'c'),
  post('fr/draft', '2026-04-01', ['securite'], 'd', true),
  post('en/a', '2026-01-01', ['security', 'red-team'], 'a'),
  post('en/b', '2026-02-01', ['ai', 'development'], 'b'),
];

const ids = (list: PostLike[]) => list.map((p) => p.id);

describe('paths', () => {
  it('builds post and tag paths in the canonical (trailing-slash) shape', () => {
    expect(postPath(posts[0])).toBe('/blog/a/');
    expect(postPath(posts[4])).toBe('/en/blog/a/');
    expect(tagPath('fr', 'ia')).toBe('/blog/tags/ia/');
    expect(tagPath('en', 'ai')).toBe('/en/blog/tags/ai/');
  });
});

describe('publishedPosts / tagsOf', () => {
  it('keeps one locale, drops drafts, newest first', () => {
    expect(ids(publishedPosts(posts, 'fr'))).toEqual(['fr/c', 'fr/b', 'fr/a']);
  });

  it('lists the tags of published posts only, without duplicates', () => {
    expect(tagsOf(posts, 'fr')).toEqual(['developpement', 'ia', 'red-team', 'securite']);
    expect(tagsOf(posts, 'en')).toEqual(['ai', 'development', 'red-team', 'security']);
  });
});

describe('adjacentPosts', () => {
  it('returns the older post as previous and the newer one as next', () => {
    const { previous, next } = adjacentPosts(posts, posts[1]);
    expect(previous?.id).toBe('fr/a');
    expect(next?.id).toBe('fr/c');
  });

  it('has no previous for the oldest post and no next for the newest', () => {
    expect(adjacentPosts(posts, posts[0]).previous).toBeUndefined();
    expect(adjacentPosts(posts, posts[2]).next).toBeUndefined();
  });

  it('never crosses locales nor lands on a draft', () => {
    expect(adjacentPosts(posts, posts[2]).next).toBeUndefined();
    expect(adjacentPosts(posts, posts[4]).next?.id).toBe('en/b');
  });
});

describe('relatedPosts', () => {
  it('returns posts sharing a tag, excluding the current post and drafts', () => {
    expect(ids(relatedPosts(posts, posts[0]))).toEqual(['fr/c']);
  });

  it('ranks by number of shared tags, then by date', () => {
    const current = post('fr/x', '2026-05-01', ['securite', 'ia']);
    expect(ids(relatedPosts([...posts, current], current))).toEqual(['fr/c', 'fr/b', 'fr/a']);
  });

  it('respects the limit and is empty when no tag matches', () => {
    const current = post('fr/x', '2026-05-01', ['securite', 'ia']);
    expect(relatedPosts([...posts, current], current, 1)).toHaveLength(1);
    expect(relatedPosts(posts, post('fr/y', '2026-05-01', ['autre']))).toEqual([]);
  });
});

describe('counterpartOf / tagCounterpart', () => {
  it('finds the translated post by translationId', () => {
    expect(counterpartOf(posts, posts[0])?.id).toBe('en/a');
    expect(counterpartOf(posts, posts[2])).toBeUndefined();
  });

  it('pairs tags by position across translated posts', () => {
    expect(tagCounterpart(posts, 'fr', 'securite')).toBe('security');
    expect(tagCounterpart(posts, 'fr', 'red-team')).toBe('red-team');
    expect(tagCounterpart(posts, 'en', 'development')).toBe('developpement');
  });

  it('leaves a tag unpaired when translations disagree or do not exist', () => {
    // `ia` is tags[0] of fr/b (→ `ai`) but tags[1] of fr/c, which has no translation: still `ai`.
    expect(tagCounterpart(posts, 'fr', 'ia')).toBe('ai');
    const conflicting = [...posts, post('fr/e', '2026-06-01', ['red-team'], 'e'), post('en/e', '2026-06-01', ['pentest'], 'e')];
    expect(tagCounterpart(conflicting, 'fr', 'red-team')).toBeUndefined();
    expect(tagCounterpart(posts, 'fr', 'unknown')).toBeUndefined();
  });
});
