---
title: "Penser comme un attaquant quand on écrit du code"
description: "Quelques réflexes de red teamer utiles à tout développeur, même en dehors d'un audit de sécurité."
date: 2026-04-03
tags: ["securite", "red-team"]
translationId: "thinking-like-attacker"
---

On n'a pas besoin d'être en mission d'audit pour appliquer des réflexes de red team au développement quotidien.

## Se demander « qu'est-ce que je ferais si j'étais malveillant ici »

Avant de valider une fonctionnalité, je me pose systématiquement la question : si j'étais un attaquant avec accès à cette interface, à cette API, à ce paramètre — qu'est-ce que je tenterais ?

## Ne jamais faire confiance à une entrée, même « interne »

Un système interne d'aujourd'hui peut devenir un système exposé demain. Valider les entrées à la frontière, systématiquement, évite bien des surprises.

## Documenter les hypothèses de sécurité

Chaque décision implicite du type « ce champ ne peut pas dépasser X caractères » ou « cet endpoint n'est appelé que par notre frontend » doit être écrite noir sur blanc — et vérifiée.
