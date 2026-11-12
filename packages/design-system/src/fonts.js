// The three typefaces, as font-family definitions for the Astro Fonts API
// (`fonts` in astro.config.mjs, rendered by <Font cssVariable="…" />).
//
// Files come from the pinned @fontsource packages (dependencies of this
// package), resolved here so the consumer never reaches into them. Only the
// latin subset in woff2 is shipped: it covers French and English (é, à, ç, œ,
// €, typographic quotes and dashes); any other glyph uses the fallback font.
// Nothing is fetched at build time and nothing at run time from a third party.
//
// Each cssVariable is read by the matching role token in tokens.css
// (--font-sans, --font-serif, --font-mono), which keeps a plain stack as
// fallback for pages built without Astro (e.g. the specimen).
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

/** Absolute path of a file shipped in a @fontsource package's `files/`. */
const file = (pkg, name) => join(dirname(require.resolve(pkg)), 'files', name);

/** fontsource's "latin" unicode-range. */
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

/** @type {import('./fonts').FontFamilyDefinition[]} */
export const fontFamilies = [
  {
    name: 'Geist',
    cssVariable: '--font-geist',
    fallbacks: ['sans-serif'],
    variants: [
      {
        src: [file('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2')],
        weight: '100 900',
        style: 'normal',
        unicodeRange: [LATIN],
      },
    ],
  },
  {
    name: 'Instrument Serif',
    cssVariable: '--font-instrument-serif',
    fallbacks: ['serif'],
    variants: ['normal', 'italic'].map((style) => ({
      src: [file('@fontsource/instrument-serif', `instrument-serif-latin-400-${style}.woff2`)],
      weight: 400,
      style,
      unicodeRange: [LATIN],
    })),
  },
  {
    name: 'JetBrains Mono',
    cssVariable: '--font-jetbrains-mono',
    fallbacks: ['monospace'],
    variants: [
      {
        src: [file('@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')],
        weight: '100 800',
        style: 'normal',
        unicodeRange: [LATIN],
      },
    ],
  },
];
