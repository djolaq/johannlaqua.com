# AGENTS.md — johannlaqua.com

Référence d'architecture pour tout agent IA (Claude Code, Codex, etc.) travaillant sur ce repo. À tenir à jour à chaque changement structurant (nouvelle stack, nouveau dossier, changement de convention). Le `README.md` reste la doc utilisateur/contributeur en français ; ce fichier est la doc *agent*, plus dense et orientée décisions.

## Vue d'ensemble

Site personnel statique de Johann Laqua (Senior Developer · AI-Boosted · Cybersecurity Red & Blue Team). Bilingue FR/EN, zéro JS côté client par défaut, construit avec Astro en mode `output: 'static'`.

- **Repo** : `djolaq/johannlaqua.com`
- **Domaine cible** : `https://johannlaqua.com` (voir `site` dans `astro.config.mjs`)
- **Contact/identité git** : johann@laqua.fr

## Stack

| Domaine | Choix | Pourquoi |
|---|---|---|
| Framework | Astro 7 (`astro.config.mjs`) | Statique par défaut, composants réutilisables, pas de runtime JS imposé |
| i18n | i18n natif Astro (`i18n.defaultLocale: 'fr'`, `locales: ['fr','en']`, `prefixDefaultLocale: false`) | FR à la racine `/`, EN sous `/en/` |
| Contenu blog | Content Layer API (`src/content.config.ts`, loader `glob`) — **pas** l'ancienne Content Collections API | Nécessaire avec Astro 7 |
| CSS | CSS natif + custom properties, aucun framework | Bundle minimal, un seul fichier de tokens comme source de vérité |
| Sitemap | `@astrojs/sitemap` | SEO |
| Tests unitaires | Vitest (`vitest.config.ts`) | Logique pure (i18n utils) |
| Tests e2e | Playwright (`playwright.config.ts`) | Pages réellement servies (build + `astro preview`) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | `npm run check` + tests unit + e2e sur chaque push/PR, Node 22 requis par Astro 7 |
| TypeScript | `astro/tsconfigs/strict` | Strict par défaut |

Node.js 22.12+ requis (Astro 7).

## Arborescence

```
astro.config.mjs        i18n routing, sitemap, output static
src/
  components/            composants UI (.astro), un fichier par composant, pas de logique métier lourde
  layouts/
    BaseLayout.astro      <head>, Header, Footer, meta i18n/SEO — layout racine de toutes les pages
    BlogPostLayout.astro  layout spécifique aux articles (au-dessus de BaseLayout)
  i18n/
    ui.ts                 dictionnaire de traduction FR/EN — SOURCE UNIQUE des chaînes UI, type UiKey dérivé des clés FR
    utils.ts               getLangFromUrl, useTranslations(locale), localizePath, getAlternateLocalePath
  content/
    blog/fr/*.md           articles FR
    blog/en/*.md            articles EN
  content.config.ts        schéma Zod de la collection "blog" (voir ci-dessous)
  pages/
    index.astro             accueil FR (racine, locale par défaut)
    blog/index.astro         liste des articles FR
    blog/[slug].astro        article FR
    en/index.astro           accueil EN
    en/blog/index.astro      liste des articles EN
    en/blog/[slug].astro      article EN
  styles/
    tokens.css              design tokens (custom properties) — SOURCE DE VÉRITÉ visuelle
    global.css               reset + styles de base
public/                    favicon.svg, robots.txt (assets statiques servis tels quels)
tests/
  unit/                    Vitest — logique pure uniquement
  e2e/                     Playwright — vraies pages (home, bascule de langue)
.github/workflows/ci.yml   pipeline CI
.claude/skills/            skills projet pour agents Claude Code (voir plus bas)
```

## Conventions à respecter

### i18n
- Toute chaîne affichée à l'utilisateur passe par `src/i18n/ui.ts` + `useTranslations()`. Ne jamais hardcoder du texte visible dans un composant `.astro`.
- Les objets `ui.fr` et `ui.en` doivent avoir **exactement les mêmes clés** (le type `UiKey` est dérivé de `ui.fr` — un déséquilibre casse le typage ou silencieusement retombe sur le FR via le fallback de `useTranslations`).
- FR est la locale par défaut et vit à la racine (`/`), pas de préfixe `/fr/`. EN vit sous `/en/`. Toute nouvelle route doit être dupliquée dans les deux arborescences de `src/pages/` (`pages/x.astro` et `pages/en/x.astro`).

### Contenu blog
- Un article = deux fichiers Markdown, un par langue, reliés par le champ `translationId` (même valeur des deux côtés) défini dans `content.config.ts`. C'est ce qui permet à la bascule de langue de retrouver l'article traduit.
- Schéma (`src/content.config.ts`) : `title`, `description`, `date` (coercible), `tags: string[]` (défaut `[]`), `draft: boolean` (défaut `false`), `translationId: string` (obligatoire).
- Slugs FR et EN peuvent différer (le slug vient du nom de fichier via le loader `glob`) — c'est `translationId`, pas le slug, qui lie les deux versions.

### Design system
- `src/styles/tokens.css` est la source de vérité visuelle (couleurs, typo, espacements, rayons, ombres, motion). Toute nouvelle valeur de style doit passer par un token existant ou un nouveau token ajouté ici — pas de valeur magique dans les composants.
- Palette : fond quasi noir, accent "signal" teal/vert (blue team, usage principal), accent "alert" rouge (red team, usage parsimonieux). Police système uniquement (`--font-sans`/`--font-mono`), pas de web font externe (perf + confidentialité).
- Si un canvas Claude Design est utilisé en parallèle pour ce site, toute valeur modifiée là-bas doit être reportée dans `tokens.css` (et vice versa) — ce fichier ne doit jamais diverger.

### Style de code
- Composants Astro : un composant = un fichier `.astro`, props typées, pas de logique métier lourde (garder ça dans `i18n/utils.ts` ou équivalent).
- Zéro JS client par défaut : n'ajouter du JS (`<script>` dans un `.astro`) que pour un besoin interactif réel (ex. `LanguageToggle`), jamais par défaut.

## Tests & CI

```bash
npm run check      # astro check — typage
npm run test:unit  # Vitest — tests/unit/
npm run test:e2e   # build + astro preview + Playwright — tests/e2e/
npm test           # les deux
```

CI (`.github/workflows/ci.yml`) exécute `check` → `test:unit` → install navigateurs Playwright → `test:e2e` sur chaque push et PR, Node 22. Le rapport Playwright est uploadé seulement en cas d'échec.

Avant de proposer un changement comme terminé : lancer `npm run check` et les tests concernés. Toute nouvelle route ou tout nouveau composant interactif mérite un test e2e ; toute nouvelle fonction pure dans `i18n/utils.ts` mérite un test unitaire.

## Skills projet

Voir `.claude/skills/` :
- `new-blog-post` — scaffold un article FR+EN avec frontmatter et `translationId` cohérents.
- `add-i18n-string` — ajoute une clé de traduction en gardant `ui.fr`/`ui.en` synchronisés.
- `sync-design-tokens` — vérifie la cohérence de `tokens.css` comme source de vérité du design system.

## À faire connu / dette

- `src/components/Footer.astro` et `src/components/ContactCTA.astro` contiennent des URLs placeholder pour GitHub/LinkedIn (`https://github.com/`, `https://www.linkedin.com/`) — à remplacer par les vrais profils.

## Maintenance de ce fichier

Ce fichier doit être mis à jour à chaque changement structurant : nouvelle dépendance majeure, nouveau dossier sous `src/`, changement de convention i18n/contenu/design, changement de pipeline CI. Ne pas y dupliquer ce qui est déjà autoritaire ailleurs (ex. la liste exacte des scripts npm vit dans `package.json`) — renvoyer vers la source plutôt que la recopier quand elle bouge souvent.
