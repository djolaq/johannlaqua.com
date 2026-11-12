#!/usr/bin/env node
// Size budget of the built site (dist/). Fails when a page, its client JS or
// the fonts grow past the limits below — it guards the "zero client JS"
// promise and catches accidental bloat. Run after a build:
//   node scripts/size-budget.mjs [dist-dir]
// Raising a limit is a deliberate decision: change it here, in the same PR
// as the change that needs it, and say why.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const KiB = 1024;
const BUDGET = {
  // Per page, gzip, everything inlined (CSS, font-face rules, SVG). The home
  // page is ~13.4 KiB; the first TCP round trip carries ~14 KiB.
  htmlGzip: 16 * KiB,
  // Per page: inline <script> (JSON-LD excluded) + external scripts. Zero by
  // policy (AGENTS.md, ADR 0004): raise only with an explicit decision.
  clientJs: 0,
  // Render-blocking <link rel="stylesheet"> per page (CSS is inlined).
  blockingStylesheets: 0,
  // All font files together. Only latin woff2 subsets are shipped (~110 KiB).
  fonts: 128 * KiB,
};
const FONT_EXT = new Set(['.woff2', '.woff', '.ttf', '.otf', '.eot']);

const dist = process.argv[2] ?? fileURLToPath(new URL('../dist', import.meta.url));
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`✗ No build in ${dist} — run the build first.`);
  process.exit(1);
}

const files = (function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
})(dist);

const fmt = (bytes) => `${(bytes / KiB).toFixed(1)} KiB`;
const failures = [];
const check = (ok, message) => ok || failures.push(message);

const rows = [];
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const page = relative(dist, file);
  const html = readFileSync(file, 'utf8');
  const gzip = gzipSync(html, { level: 9 }).length;

  let js = 0;
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/type\s*=\s*["']?application\/ld\+json/i.test(attrs)) continue;
    const src = attrs.match(/\bsrc\s*=\s*["']?([^"'\s>]+)/i)?.[1];
    if (src?.startsWith('/')) js += existsSync(join(dist, src)) ? statSync(join(dist, src)).size : 0;
    else if (src) failures.push(`${page}: third-party script ${src}`);
    js += Buffer.byteLength(body);
  }
  const stylesheets = [...html.matchAll(/<link\b[^>]*rel\s*=\s*["']?stylesheet/gi)].length;

  rows.push({ page, gzip: fmt(gzip), js: `${js} B`, stylesheets });
  check(gzip <= BUDGET.htmlGzip, `${page}: HTML is ${fmt(gzip)} gzip (budget ${fmt(BUDGET.htmlGzip)})`);
  check(js <= BUDGET.clientJs, `${page}: ${js} B of client JS (budget ${BUDGET.clientJs} B)`);
  check(
    stylesheets <= BUDGET.blockingStylesheets,
    `${page}: ${stylesheets} render-blocking stylesheet(s) (budget ${BUDGET.blockingStylesheets})`,
  );
}

const fontFiles = files.filter((f) => FONT_EXT.has(extname(f)));
const fonts = fontFiles.reduce((sum, f) => sum + statSync(f).size, 0);
check(fonts <= BUDGET.fonts, `fonts: ${fmt(fonts)} in ${fontFiles.length} files (budget ${fmt(BUDGET.fonts)})`);
for (const f of fontFiles.filter((f) => extname(f) !== '.woff2')) {
  failures.push(`${relative(dist, f)}: only woff2 is shipped`);
}

console.table(rows.sort((a, b) => a.page.localeCompare(b.page)));
console.log(`fonts: ${fmt(fonts)} in ${fontFiles.length} files`);

if (failures.length) {
  console.error(`\n✗ Size budget exceeded:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ Within the size budget.');
