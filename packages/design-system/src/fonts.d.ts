export interface FontVariant {
  /** Absolute path of the woff2 file. */
  src: [string];
  weight: string | number;
  style: 'normal' | 'italic';
  unicodeRange: [string];
}

export interface FontFamilyDefinition {
  /** Family name as written in the generated @font-face rules. */
  name: string;
  /** Custom property the Astro Fonts API defines with the full stack. */
  cssVariable: `--${string}`;
  /** Generic family: Astro derives a metric-matched local fallback from it. */
  fallbacks: string[];
  variants: [FontVariant, ...FontVariant[]];
}

export declare const fontFamilies: readonly FontFamilyDefinition[];
