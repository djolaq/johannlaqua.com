#!/usr/bin/env node
/**
 * Internal link checker for the built site.
 *
 * Runs offline on `apps/site/dist/` after a build and fails on:
 * - an internal `href`/`src` that resolves to no file in `dist/`;
 * - a `#fragment` whose target id does not exist in the destination page;
 * - a `url(...)` in a generated stylesheet pointing at a missing asset.
 *
 * External URLs, `mailto:` and `tel:` are out of scope (no network in CI, and
 * the repo deliberately keeps its toolchain dependency-free). Anchors are the
 * part the type system and Astro's build cannot see, hence this script.
 *
 * Usage: node scripts/check-links.mjs [distDir]
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const distDir = resolve(process.argv[2] ?? join(root, 'dist'));

if (!existsSync(distDir)) {
  console.error(`✗ ${relative(process.cwd(), distDir)} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const REFERENCE_ATTRIBUTE = /\b(?:href|src)="([^"]*)"/g;
const CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function walk(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path, extension);
    return extname(entry.name) === extension ? [path] : [];
  });
}

/** Resolve an absolute or relative path to a file in `dist/`, or null. */
function resolveFile(pathname, fromFile) {
  const cleaned = pathname.replace(/\/+$/, '');
  const base =
    cleaned === '' ? distDir : cleaned.startsWith('/') ? join(distDir, cleaned) : resolve(fromFile, '..', cleaned);
  const candidates = [base, `${base}.html`, join(base, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

/** ids and legacy `<a name>` anchors of a page. */
function anchorsOf(file) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/<a\s[^>]*\bname="([^"]+)"/g)) ids.add(match[1]);
  return ids;
}

const anchorCache = new Map();
function anchors(file) {
  if (!anchorCache.has(file)) anchorCache.set(file, anchorsOf(file));
  return anchorCache.get(file);
}

const failures = new Set();
const pages = walk(distDir, '.html');
const stylesheets = walk(distDir, '.css');
let checked = 0;

function check(reference, fromFile) {
  const raw = reference.trim();
  if (raw === '' || raw === '#' || raw.startsWith('//') || SCHEME.test(raw)) return;
  checked += 1;

  const [withoutQuery] = raw.split('?');
  const hashIndex = withoutQuery.indexOf('#');
  const pathname = hashIndex === -1 ? withoutQuery : withoutQuery.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : withoutQuery.slice(hashIndex + 1);

  const target = pathname === '' ? fromFile : resolveFile(decodeURIComponent(pathname), fromFile);
  if (!target) {
    failures.add(`${relative(distDir, fromFile)} → ${raw} (no such file in dist/)`);
    return;
  }

  if (fragment !== '' && !anchors(target).has(decodeURIComponent(fragment))) {
    failures.add(`${relative(distDir, fromFile)} → ${raw} (missing #${fragment} in ${relative(distDir, target)})`);
  }
}

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(REFERENCE_ATTRIBUTE)) check(match[1], page);
}

for (const stylesheet of stylesheets) {
  const css = readFileSync(stylesheet, 'utf8');
  for (const match of css.matchAll(CSS_URL)) check(match[1], stylesheet);
}

const summary = `${pages.length} HTML pages, ${stylesheets.length} stylesheets, ${checked} internal references`;

if (failures.size > 0) {
  console.error(`✗ ${failures.size} broken internal reference(s) — ${summary}\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`✓ no broken internal reference — ${summary}`);
