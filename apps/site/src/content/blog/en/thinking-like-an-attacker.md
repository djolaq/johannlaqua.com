---
title: "Thinking like an attacker while writing code"
description: "A few red-team reflexes that are useful to any developer, even outside a formal security audit."
date: 2026-04-03
tags: ["security", "red-team"]
translationId: "thinking-like-attacker"
---

You don't need to be on an audit engagement to apply red-team reflexes to everyday development.

## Ask "what would I do here if I were malicious"

Before shipping a feature, I systematically ask myself: if I were an attacker with access to this interface, this API, this parameter — what would I try?

## Never trust an input, even an "internal" one

Today's internal system can become tomorrow's exposed one. Validating input at the boundary, every time, avoids a lot of surprises later.

## Write down your security assumptions

Every implicit decision like "this field can't exceed X characters" or "this endpoint is only ever called by our frontend" needs to be written down explicitly — and verified.
