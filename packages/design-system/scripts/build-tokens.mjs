#!/usr/bin/env node
// Generates tokens/tokens.json (W3C Design Tokens–style groups) from
// src/tokens.css, for Figma / Tokens Studio or any other tool.
//   node scripts/build-tokens.mjs           write the file
//   node scripts/build-tokens.mjs --check   exit 1 if it is out of date
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(new URL('../src/tokens.css', import.meta.url), 'utf8');
const start = css.indexOf(':root');
const rootBlock = css.slice(start, css.indexOf('\n}', start));

const groups = [
  ['color', /^(charcoal|sand|blue|on-blue)/],
  ['semantic', /^(surface|text$|text-muted|text-faint|rule|link|accent-stroke)/],
  ['font', /^font-/],
  ['fontSize', /^text-/],
  ['lineHeight', /^leading-/],
  ['fontWeight', /^weight-/],
  ['letterSpacing', /^tracking-/],
  ['fontStretch', /^stretch-/],
  ['space', /^space-/],
  ['layout', /^(content-width|measure|gutter|header-height|announce-height)/],
  ['radius', /^radius-/],
  ['shadow', /^(shadow|blur)-/],
  ['line', /^(line|underline)-/],
  ['motion', /^(ease|duration)-/],
  ['zIndex', /^z-/],
];
const typeOf = { color: 'color', semantic: 'color', font: 'fontFamily', fontSize: 'dimension', space: 'dimension', radius: 'dimension', fontWeight: 'fontWeight' };

const json = {};
for (const [, name, rawValue, comment] of rootBlock.matchAll(/--([a-z0-9-]+):\s*([^;]+);(?:[ \t]*\/\*\s*([^*]+?)\s*\*\/)?/g)) {
  const group = groups.find(([, re]) => re.test(name))?.[0] ?? 'other';
  const value = rawValue.trim().replace(/\s+/g, ' ');
  const token = { $value: /^var\(--[a-z0-9-]+\)$/.test(value) ? `{${value.slice(6, -1)}}` : value };
  if (typeOf[group]) token.$type = typeOf[group];
  else if (group === 'motion' && name.startsWith('duration')) token.$type = 'duration';
  if (comment) token.$description = comment;
  (json[group] ??= {})[name] = token;
}

const text = `${JSON.stringify(json, null, 2)}\n`;
const out = fileURLToPath(new URL('../tokens/tokens.json', import.meta.url));
if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== text) {
    console.error('✗ tokens/tokens.json is out of date — run `npm run build -w @johannlaqua/design-system`.');
    process.exit(1);
  }
  console.log('✓ tokens/tokens.json is up to date.');
} else {
  mkdirSync(new URL('../tokens/', import.meta.url), { recursive: true });
  writeFileSync(out, text);
  console.log('✓ tokens/tokens.json');
}
