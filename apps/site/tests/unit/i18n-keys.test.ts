import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ui } from '../../src/i18n/ui';

/**
 * Guards the single source of UI strings (`src/i18n/ui.ts`).
 *
 * Two rules the type system cannot enforce on its own:
 * - FR and EN must expose exactly the same keys (a missing EN key silently
 *   falls back to FR at runtime);
 * - no key may be left unused (dead copy drifts out of sync with the pages).
 *
 * The "referenced" set is collected from string literals under `src/`, which
 * covers `t('key')` calls as well as keys held in typed data files
 * (`descriptionKey` in `projects.ts`). A key reached through a computed
 * template literal must therefore be spelled out as a literal somewhere too;
 * none is today.
 */

const SRC_DIR = fileURLToPath(new URL('../../src', import.meta.url));
const UI_MODULE = join('i18n', 'ui.ts');
const SOURCE_EXTENSIONS = new Set(['.astro', '.ts']);

const frKeys = Object.keys(ui.fr);
const enKeys = Object.keys(ui.en);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

/** Every key-looking string literal used outside the dictionary itself. */
const referencedKeys = new Set(
  sourceFiles(SRC_DIR)
    .filter((path) => !path.endsWith(UI_MODULE))
    .flatMap((path) => [...readFileSync(path, 'utf8').matchAll(/'([a-zA-Z][\w]*(?:\.[\w]+)+)'/g)])
    .map((match) => match[1]),
);

describe('i18n dictionary', () => {
  it('exposes the same keys in FR and EN', () => {
    const missingInEn = frKeys.filter((key) => !enKeys.includes(key));
    const missingInFr = enKeys.filter((key) => !frKeys.includes(key));

    expect({ missingInEn, missingInFr }).toEqual({ missingInEn: [], missingInFr: [] });
  });

  it('has no empty value', () => {
    for (const locale of ['fr', 'en'] as const) {
      const empty = Object.entries(ui[locale])
        .filter(([, value]) => value.trim() === '')
        .map(([key]) => key);
      expect({ locale, empty }).toEqual({ locale, empty: [] });
    }
  });

  it('has no unreferenced key', () => {
    expect(frKeys.filter((key) => !referencedKeys.has(key))).toEqual([]);
  });
});
