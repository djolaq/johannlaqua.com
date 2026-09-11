---
name: add-i18n-string
description: Add or update a UI translation string in johannlaqua.com's i18n dictionary, keeping the FR and EN key sets in sync. Use when the user asks to add new UI text, a new label/button/heading, or change existing site copy.
---

# add-i18n-string

Ajoute ou modifie une chaîne de texte UI sur johannlaqua.com sans jamais désynchroniser les clés FR/EN.

## Contexte

Toutes les chaînes visibles à l'utilisateur vivent dans `src/i18n/ui.ts`, dans deux objets `ui.fr` et `ui.en` avec exactement le même jeu de clés. Le type `UiKey` (`export type UiKey = keyof (typeof ui)['fr']`) est dérivé de `ui.fr` — c'est donc l'objet `fr` qui fait autorité pour le typage, mais les deux objets doivent rester alignés en pratique.

`useTranslations(locale)` (dans `src/i18n/utils.ts`) retourne une fonction `t(key)` qui a un fallback silencieux vers `ui[defaultLocale][key]` si une clé manque côté `en` — donc un oubli ne casse pas le build mais affiche du français sur la version anglaise sans avertissement. Il faut éviter cet oubli, pas compter sur le fallback.

Les clés suivent une convention `section.element` ou `section.element.variant` (ex. `hero.cta.primary`, `services.security.badge`), groupées par section de page dans le fichier (site, nav, hero, about, services, blog, contact, footer).

## Étapes

1. Identifier la section concernée dans `src/i18n/ui.ts` (ou en créer une nouvelle si c'est un nouveau composant/section de page).
2. Choisir une clé cohérente avec la convention existante (`section.element[.variant]`).
3. Ajouter la clé et sa valeur FR dans `ui.fr`, **et immédiatement après** la clé et sa valeur EN correspondante dans `ui.en`, au même endroit relatif dans les deux objets (même ordre, pour que le fichier reste lisible en diff).
4. Utiliser la nouvelle clé dans le composant `.astro` via `t('section.element')` — jamais de texte hardcodé.
5. Ne jamais ajouter une clé dans un seul des deux objets. Si le texte FR/EN exact n'est pas encore connu, mettre un texte provisoire clairement identifiable (ex. `[FR] ...` / `[EN] ...`) plutôt que d'omettre la clé.

## Vérification

Après modification, relire `ui.fr` et `ui.en` et confirmer qu'ils ont le même nombre de clés et les mêmes noms de clés. Lancer `npm run check` (le typage `UiKey` remonte une erreur si une clé référencée via `t()` n'existe pas côté FR, mais ne détecte pas un manque côté EN — la relecture manuelle reste nécessaire).
