/**
 * Content-Security-Policy delivered by `<meta http-equiv>` in BaseLayout.
 *
 * The site ships no script, no inline style and no third-party resource, so
 * everything is denied except same-origin styles, images and fonts.
 * `script-src 'none'` does not block the JSON-LD block: data blocks are never
 * executed. `data:` images cover the SVG data URIs some CSS uses.
 *
 * `frame-ancestors`, `report-to` and HSTS are ignored in `<meta>`: the host
 * sends them as real headers (deploy/headers/). Keep the directives below
 * identical to the CSP in those files.
 */
export const contentSecurityPolicy = [
  "default-src 'none'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "script-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');
