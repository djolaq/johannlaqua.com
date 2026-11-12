import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** Lowercase slugs (they become `/blog/tags/<tag>/` URLs), same order as in the translation. */
    tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).default([]),
    draft: z.boolean().default(false),
    /** Shared key linking this post to its translation in the other locale, if any. */
    translationId: z.string(),
  }),
});

export const collections = { blog };
