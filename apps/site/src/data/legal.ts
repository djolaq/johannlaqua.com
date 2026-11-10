/**
 * Publisher and host details shown on the legal notice and privacy pages.
 *
 * Single source of truth: edit the values here, not in the page files.
 * The publisher is a private individual (non-professional), so under French
 * law (LCEN, art. 6-III-2) no postal address or SIRET has to be published:
 * the host holds the publisher's identity. The host must still be fully named.
 */
export const legal = {
  publisher: {
    name: 'Johann Laqua',
    email: 'johann@laqua.fr',
  },
  /** Person responsible for the published content (directeur de la publication). */
  publicationDirector: 'Johann Laqua',
  host: {
    name: 'Infomaniak Network SA',
    address: 'Rue Eugène-Marziano 25, 1227 Les Acacias (GE), Suisse',
    phone: '+41 22 820 35 44',
    website: 'https://www.infomaniak.com',
  },
  /** Date shown as "last updated" on both pages (ISO format). */
  lastUpdated: '2026-10-14',
} as const;
