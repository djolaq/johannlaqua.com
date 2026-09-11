---
name: sync-design-tokens
description: Check and maintain src/styles/tokens.css as the single source of truth for johannlaqua.com's design system (colors, type scale, spacing, radii, motion). Use when the user wants to change site styling/colors/spacing, add a new visual component, or mentions syncing with a Claude Design canvas.
---

# sync-design-tokens

Garantit que `src/styles/tokens.css` reste l'unique source de vérité du design system de johannlaqua.com, et repère les divergences.

## Contexte

`src/styles/tokens.css` définit toutes les valeurs visuelles en custom properties CSS sur `:root` :

- Surfaces : `--color-bg`, `--color-bg-raised`, `--color-bg-inset`, `--color-border`, `--color-border-strong`
- Texte : `--color-text`, `--color-text-muted`, `--color-text-faint`
- Accents (duo red team/blue team) : `--color-signal*` (teal/vert, usage principal) et `--color-alert*` (rouge, usage parcimonieux)
- Typo : `--font-sans`/`--font-mono` (police système uniquement, pas de web font), `--text-*` (échelle xs→4xl), `--leading-*`, `--weight-*`
- Espacement : `--space-1` à `--space-10` (base 4px)
- Layout : `--content-width`, `--content-width-narrow`, `--gutter` (responsive via le breakpoint `48em`)
- Radii : `--radius-sm/md/lg/full`
- Élévation : `--shadow-sm/md/glow`
- Motion : `--ease-out`, `--duration-fast/base`
- Z-index : `--z-header`, `--z-overlay`

`src/styles/global.css` ne contient que le reset et les styles de base — pas de nouvelles valeurs de design, seulement des usages des tokens ci-dessus.

Le README et `AGENTS.md` mentionnent qu'un canvas Claude Design peut exister en parallèle pour ce site ; si c'est le cas, toute valeur modifiée dans le canvas doit être reportée ici (et vice versa) — les deux ne doivent jamais diverger.

## Quand l'utiliser

- Avant de créer un nouveau composant `.astro` : vérifier qu'aucune valeur (couleur, espacement, rayon, ombre) n'existe déjà comme token avant d'en écrire une nouvelle en dur.
- Quand l'utilisateur demande un changement visuel (couleur, taille de texte, espacement) : modifier le token dans `tokens.css`, pas la valeur dans le composant, sauf s'il s'agit d'un cas vraiment ponctuel (et dans ce cas, le signaler explicitement comme dérogation).
- Quand l'utilisateur mentionne un canvas Claude Design ou Figma : comparer les valeurs et proposer un diff des tokens à mettre à jour.

## Étapes

1. Lire `src/styles/tokens.css` pour l'état actuel.
2. Si la demande vient d'un changement fait ailleurs (canvas Design, maquette), identifier précisément quelles custom properties doivent changer de valeur — ne jamais dupliquer une valeur brute dans un composant.
3. Modifier les valeurs dans `tokens.css` uniquement. Si un composant utilise une valeur magique en dur (`grep` rapide sur les `.astro` pour des couleurs hex, des `px`/`rem` suspects), proposer de la remplacer par le token correspondant.
4. Si une nouvelle valeur est nécessaire et n'a pas d'équivalent, l'ajouter dans la section appropriée de `tokens.css` avec un nom cohérent avec la convention existante (`--categorie-nom[-variante]`), pas directement dans un composant.
5. Vérifier visuellement en local (`npm run dev`) que le changement a l'effet attendu dans les deux thèmes/pages FR et EN si pertinent.

## Vérification

`grep` sur `src/components/**/*.astro` et `src/layouts/**/*.astro` pour des valeurs de couleur (`#`, `rgb`, `rgba`) ou de taille en dur qui devraient être des tokens — un design "source de vérité" qui fuit dans les composants finit par diverger silencieusement.
