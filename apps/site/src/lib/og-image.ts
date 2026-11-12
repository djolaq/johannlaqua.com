// Build-time social card (Open Graph / Twitter), 1200×630 PNG.
// Satori lays the card out and turns the text into SVG paths with the
// self-hosted fonts; sharp rasterises the SVG. Everything runs locally at
// build time — no image service, no third-party request.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import tokens from '@johannlaqua/design-system/tokens.json';
import { createNetworkField } from '@johannlaqua/design-system/network-field';

import { ogImageSize } from '../i18n/utils';

const { width: OG_WIDTH, height: OG_HEIGHT } = ogImageSize;

export interface OgCard {
  /** Small uppercase line above the title (section, date…). */
  kicker: string;
  title: string;
  description?: string;
}

const color = (name: keyof typeof tokens.color) => tokens.color[name].$value;
const C = {
  charcoal: color('charcoal-900'),
  sand50: color('sand-50'),
  sand300: color('sand-300'),
  sand500: color('sand-500'),
  blue: color('blue-500'),
  blueText: color('blue-300'),
};

const require = createRequire(import.meta.url);
// Satori reads TTF/OTF/WOFF (not WOFF2), hence the static @fontsource builds.
const font = (file: string) => readFileSync(require.resolve(`@fontsource/${file}`));
const fonts = [
  { name: 'Geist', weight: 400 as const, style: 'normal' as const, data: font('geist/files/geist-latin-400-normal.woff') },
  { name: 'Geist', weight: 500 as const, style: 'normal' as const, data: font('geist/files/geist-latin-500-normal.woff') },
  {
    name: 'JetBrains Mono',
    weight: 400 as const,
    style: 'normal' as const,
    data: font('jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'),
  },
];

/** The hero's network map, faded, as the card's right-hand backdrop. */
function networkBackdrop(): string {
  const { width: W, height: H, nodes, links, pathD, target } = createNetworkField();
  const f = (v: number) => v.toFixed(1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<g stroke="${C.sand500}" stroke-width="1">${links
    .map(({ a, b, o }) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke-opacity="${(o * 0.7).toFixed(2)}"/>`)
    .join('')}</g>
<g fill="${C.sand300}" opacity="0.4">${nodes.map((n) => `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${n.r}"/>`).join('')}</g>
<path d="${pathD}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="${f(target.x)}" cy="${f(target.y)}" r="18" fill="${C.blue}" fill-opacity="0.25" stroke="${C.blue}" stroke-width="2"/>
<circle cx="${f(target.x)}" cy="${f(target.y)}" r="6" fill="${C.blue}"/>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const backdrop = networkBackdrop();
const mark = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.5 1 3 9h4.5L6.5 15 13 7H8.5z" fill="${C.blue}"/></svg>`,
).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOgImage({ kicker, title, description }: OgCard): Promise<Buffer> {
  const titleSize = title.length > 60 ? 56 : 68;
  const tree = h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      position: 'relative',
      backgroundColor: C.charcoal,
      backgroundImage: `radial-gradient(circle at 85% 20%, ${C.blue}55, ${C.charcoal}00 55%)`,
      fontFamily: 'Geist',
      color: C.sand50,
    },
    [
      h('img', { position: 'absolute', right: -120, top: -85, width: 800, height: 800, opacity: 0.55 }, undefined, {
        src: backdrop,
        width: 800,
        height: 800,
      }),
      // Scrim: keeps the text column legible over the network lines.
      h('div', {
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(90deg, ${C.charcoal} 0%, ${C.charcoal}e6 45%, ${C.charcoal}00 80%)`,
      }),
      h(
        'div',
        {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '64px 72px',
        },
        [
          h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
            h('img', { width: 36, height: 36 }, undefined, { src: mark, width: 36, height: 36 }),
            h('div', { fontFamily: 'JetBrains Mono', fontSize: 24, color: C.sand300 }, 'johannlaqua.com'),
          ]),
          h('div', { display: 'flex', flexDirection: 'column', maxWidth: 860 }, [
            h(
              'div',
              { fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: C.blueText },
              kicker,
            ),
            h(
              'div',
              { marginTop: 20, fontSize: titleSize, fontWeight: 500, lineHeight: 1.08, letterSpacing: -1.5, lineClamp: 3 },
              title,
            ),
            ...(description
              ? [h('div', { marginTop: 28, fontSize: 28, lineHeight: 1.35, color: C.sand500, lineClamp: 2 }, description)]
              : []),
          ]),
        ],
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
}
