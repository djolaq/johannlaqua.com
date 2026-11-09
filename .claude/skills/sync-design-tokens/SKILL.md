---
name: sync-design-tokens
description: Check and maintain src/styles/tokens.css as the single source of truth for johannlaqua.com's design system (colors, type scale, spacing, radii, motion). Use when the user wants to change site styling/colors/spacing, add a new visual component, or mentions syncing with a Claude Design canvas.
---

# sync-design-tokens

Garantit que `src/styles/tokens.css` reste l'unique source de vérité du design system de johannlaqua.com, et repère les divergences.

## Contexte

`src/styles/tokens.css` définit toutes les valeurs visuelles en custom properties CSS sur `:root`. La référence complète (rôles, contrastes, règles, changelog) est `docs/design-system.md` — **les deux doivent rester synchronisés**, ainsi que le doc `claude/design-system.md` du Project claude.ai.

- Palette brute : `--charcoal-*` (950/900/800/700/500), `--sand-*` (50/300/400/500, `--sand-ink-600/700`), `--blue-*` (300/500/600/700), `--on-blue`
- Couches translucides : `--charcoal-glass`, `--sand-veil`, `--sand-hairline`, `--blue-glow`
- Tokens sémantiques : `--surface`, `--surface-raised`, `--surface-card`, `--text`, `--text-muted`, `--text-faint`, `--rule`, `--rule-strong`, `--link`, `--accent-stroke` — redéfinis par `.tone-charcoal` (défaut) / `.tone-sand` dans `global.css`. Les composants n'utilisent QUE ceux-là (plus `--blue-500`/`--on-blue` pour les boutons pleins).
- Typo : `--font-sans` (Geist), `--font-serif` (Instrument Serif, accents italiques), `--font-mono` (JetBrains Mono) ; échelle `--text-xs`→`--text-5xl` + `--text-hero`/`--text-poster` ; `--leading-*`, `--weight-*`, `--tracking-*` (dont `--tracking-caps`)
- Espacement : `--space-1` à `--space-10` (base 4px)
- Layout : `--content-width`, `--content-width-narrow`, `--measure`, `--gutter`, `--header-height`, `--announce-height`
- Radii : `--radius-xs/sm/md/lg/full` ; élévation : `--shadow-card`, `--blur-glass` ; traits : `--line-hair/bold`, `--underline-*`
- Motion : `--ease-out`, `--duration-fast/base/reveal/trace`
- Z-index : `--z-header`, `--z-overlay`

`src/styles/global.css` contient le reset, les tons, la grille de section, `.prose` et `.link` — uniquement des usages de tokens.

## Quand l'utiliser

- Avant de créer un nouveau composant `.astro` : vérifier qu'aucune valeur (couleur, espacement, rayon, ombre) n'existe déjà comme token avant d'en écrire une nouvelle en dur.
- Quand l'utilisateur demande un changement visuel (couleur, taille de texte, espacement) : modifier le token dans `tokens.css`, pas la valeur dans le composant, sauf s'il s'agit d'un cas vraiment ponctuel (et dans ce cas, le signaler explicitement comme dérogation).
- Quand l'utilisateur mentionne un canvas Claude Design ou Figma : comparer les valeurs et proposer un diff des tokens à mettre à jour.

## Étapes

1. Lire `src/styles/tokens.css` pour l'état actuel.
2. Si la demande vient d'un changement fait ailleurs (canvas Design, maquette), identifier précisément quelles custom properties doivent changer de valeur — ne jamais dupliquer une valeur brute dans un composant.
3. Modifier les valeurs dans `tokens.css` uniquement. Si un composant utilise une valeur magique en dur (`grep` rapide sur les `.astro` pour des couleurs hex, des `px`/`rem` suspects), proposer de la remplacer par le token correspondant.
4. Si une nouvelle valeur est nécessaire et n'a pas d'équivalent, l'ajouter dans la section appropriée de `tokens.css` avec un nom cohérent avec la convention existante (`--categorie-nom[-variante]`), pas directement dans un composant.
5. Mettre à jour `docs/design-system.md` (tableau concerné + ligne de changelog).
6. Vérifier visuellement en local (`npm run dev`) que le changement a l'effet attendu dans les deux thèmes/pages FR et EN si pertinent.

## Vérification

`grep` sur `src/components/**/*.astro` et `src/layouts/**/*.astro` pour des valeurs de couleur (`#`, `rgb`, `rgba`) ou de taille en dur qui devraient être des tokens — un design "source de vérité" qui fuit dans les composants finit par diverger silencieusement.
