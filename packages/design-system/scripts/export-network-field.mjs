#!/usr/bin/env node
// Exports the hero visual as a standalone SVG with literal colours
// (assets/network-field.svg), from the same geometry the site renders.
//   node scripts/export-network-field.mjs           write the file
//   node scripts/export-network-field.mjs --check   exit 1 if it is out of date
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createNetworkField } from '../src/network-field.js';

const C = { charcoal: '#1e1e1c', sand300: '#d8cbb3', sand500: '#a39a88', blue: '#2f6bff' };
const { width: W, height: H, nodes, links, path, pathD, entry, target } = createNetworkField();
const f = (v) => v.toFixed(1);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <title>Carte réseau et chemin d'attaque — visuel de l'accroche</title>
  <defs>
    <radialGradient id="glow" cx="0.78" cy="0.28" r="0.55">
      <stop offset="0" stop-color="${C.blue}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${C.blue}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.charcoal}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g stroke="${C.sand500}" stroke-width="1">
${links.map(({ a, b, o }) => `    <line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke-opacity="${o.toFixed(2)}"/>`).join('\n')}
  </g>
  <g fill="${C.sand300}" opacity="0.55">
${nodes.map((n) => `    <circle cx="${f(n.x)}" cy="${f(n.y)}" r="${n.r}"/>`).join('\n')}
  </g>
  <path d="${pathD}" fill="none" stroke="${C.blue}" stroke-width="12" stroke-opacity="0.18" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${pathD}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="${C.charcoal}" stroke="${C.blue}" stroke-width="2">
${path.map((n) => `    <rect x="${f(n.x - 4)}" y="${f(n.y - 4)}" width="8" height="8"/>`).join('\n')}
  </g>
  <circle cx="${f(entry.x)}" cy="${f(entry.y)}" r="10" fill="none" stroke="${C.sand300}" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="${f(target.x)}" cy="${f(target.y)}" r="16" fill="${C.blue}" fill-opacity="0.22" stroke="${C.blue}" stroke-width="1.5"/>
  <circle cx="${f(target.x)}" cy="${f(target.y)}" r="5" fill="${C.blue}"/>
</svg>
`;

const out = fileURLToPath(new URL('../assets/network-field.svg', import.meta.url));
if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== svg) {
    console.error('✗ assets/network-field.svg is out of date — run `npm run build -w @johannlaqua/design-system`.');
    process.exit(1);
  }
  console.log('✓ assets/network-field.svg is up to date.');
} else {
  writeFileSync(out, svg);
  console.log('✓ assets/network-field.svg');
}
