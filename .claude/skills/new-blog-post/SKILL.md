---
name: new-blog-post
description: Scaffold a new blog post in both FR and EN for johannlaqua.com, with matching translationId and consistent frontmatter. Use when the user asks to write, add, or draft a new blog/journal article.
---

# new-blog-post

Crée un nouvel article de blog en français et en anglais pour johannlaqua.com, correctement reliés pour la bascule de langue.

## Contexte

Le schéma de contenu vit dans `src/content.config.ts` (collection `blog`, loader `glob` sur `src/content/blog/**/*.md`). Champs :

- `title: string` (obligatoire)
- `description: string` (obligatoire)
- `date` (coercible en `Date`, ex. `2026-09-12`)
- `tags: string[]` (défaut `[]`)
- `draft: boolean` (défaut `false`)
- `translationId: string` (**obligatoire**) — même valeur exacte côté FR et côté EN, c'est ce qui lie les deux traductions pour la bascule de langue (voir `getAlternateLocalePath` dans `src/i18n/utils.ts`)

Les fichiers vivent dans `src/content/blog/fr/<slug-fr>.md` et `src/content/blog/en/<slug-en>.md`. Les slugs FR et EN peuvent différer (chacun vient du nom de fichier) — seul `translationId` doit matcher.

## Étapes

1. Demander à l'utilisateur (si pas déjà donné) : le sujet/titre de l'article, et s'il fournit lui-même le texte FR/EN ou si tu dois le rédiger à partir d'un brief.
2. Choisir un `translationId` court en kebab-case résumant le sujet (ex. `ai-boosted-dev`), en vérifiant qu'il n'existe pas déjà dans `src/content/blog/`.
3. Choisir un slug de fichier par langue (kebab-case, dérivé du titre dans chaque langue). Ils n'ont pas besoin d'être identiques entre FR et EN.
4. Créer `src/content/blog/fr/<slug-fr>.md` avec le frontmatter complet (`title`, `description`, `date` du jour au format `YYYY-MM-DD` sauf indication contraire, `tags`, `translationId`) suivi du contenu en Markdown, ton cohérent avec les articles existants (voir `src/content/blog/fr/*.md` pour le style : titres `##`, paragraphes courts, pas de fioritures).
5. Créer `src/content/blog/en/<slug-en>.md` de la même façon, en anglais, avec le **même `translationId`**.
6. Ne pas mettre `draft: true` sauf si l'utilisateur le demande explicitement.
7. Rappeler à l'utilisateur qu'aucune modification de `src/pages/` n'est nécessaire — les pages `blog/[slug].astro` et `en/blog/[slug].astro` résolvent dynamiquement via la collection.
8. Suggérer de lancer `npm run check` pour valider le frontmatter contre le schéma Zod.

## Vérification

Après création, relire les deux fichiers et confirmer que `translationId` est identique caractère pour caractère dans les deux frontmatters — une divergence silencieuse casse la bascule de langue sans erreur de build.
