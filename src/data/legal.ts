/**
 * Publisher and host details shown on the legal notice and privacy pages.
 *
 * Single source of truth: edit the values here, not in the page files.
 * Every value still set to a `[À compléter …]` placeholder MUST be filled in
 * before the site goes live — French law (LCEN, art. 6-III) requires a
 * professional publisher to be identifiable and the host to be named.
 */
export const legal = {
  publisher: {
    name: 'Johann Laqua',
    /** e.g. "Entrepreneur individuel (micro-entreprise)" */
    status: '[À compléter : statut juridique]',
    /** 14-digit SIRET, or remove the line if not applicable */
    siret: '[À compléter : SIRET]',
    /** Postal address — a business domiciliation address is fine */
    address: '[À compléter : adresse postale]',
    email: 'johann@laqua.fr',
  },
  /** Person responsible for the published content (directeur de la publication). */
  publicationDirector: 'Johann Laqua',
  host: {
    name: '[À compléter : nom de l’hébergeur]',
    address: '[À compléter : adresse de l’hébergeur]',
    website: '[À compléter : site de l’hébergeur]',
  },
  /** Date shown as "last updated" on both pages (ISO format). */
  lastUpdated: '2026-10-11',
} as const;
