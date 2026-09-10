# johannlaqua.com

Site personnel de Johann Laqua — développeur senior, développement assisté par IA et cybersécurité (red & blue team).

Site 100% statique, construit avec [Astro](https://astro.build), bilingue FR/EN, sans JavaScript côté client par défaut.

## Stack

- **Astro** — génération statique, zéro JS par défaut
- **Content Collections** (Content Layer API) pour les articles du journal/blog (Markdown)
- **CSS natif** avec design tokens (custom properties) — pas de framework CSS, pour garder le bundle minimal
- **i18n natif Astro** — FR à la racine (`/`), EN sous `/en/`

## Développer en local

Prérequis : Node.js 20+.

```bash
npm install
npm run dev
```

Le site est servi sur http://localhost:4321. Les pages se rechargent automatiquement.

## Autres commandes

```bash
npm run check    # vérification TypeScript / Astro
npm run build    # build statique de production dans dist/
npm run preview  # sert le build de production en local pour vérification finale
```

## Structure du projet

```
src/
  components/        composants UI réutilisables (Hero, Services, BlogCard, ...)
  layouts/            BaseLayout (head, header, footer) et BlogPostLayout
  i18n/                dictionnaire de traductions FR/EN et helpers de routage
  content/blog/fr|en/  articles du journal, un fichier Markdown par article et par langue
  content.config.ts   schéma de la collection "blog"
  pages/               fr à la racine, en sous /en/
  styles/              tokens.css (design system) + global.css (reset et styles de base)
public/                favicon, robots.txt
```

## Design system

Les tokens visuels (couleurs, typographie, espacements, rayons, ombres) vivent dans
`src/styles/tokens.css`. C'est la source de vérité : toute évolution faite dans un canvas
Claude Design doit être reportée ici (et vice-versa) pour rester synchronisée avec le code.

## Contenu à personnaliser

- `src/i18n/ui.ts` — tous les textes du site (bio, services, etc.)
- `src/content/blog/` — articles du journal
- `src/components/Footer.astro` et `src/components/ContactCTA.astro` — liens GitHub/LinkedIn (actuellement des placeholders à remplacer par les vrais profils)

## Déploiement

Le site build en fichiers statiques purs (`npm run build` → `dist/`), déployable sur
n'importe quel hébergeur statique (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.).
