---
title: "Building with AI without piling up technical debt"
description: "How I fit AI assistants into my daily workflow without trading away code quality."
date: 2026-06-12
tags: ["ai", "development"]
---

AI assistants change how fast you can write code, but not automatically how good it is. Here are the three rules I apply to keep both.

## 1. Always review it like a reviewer, not an author

Generated code has to pass the same review bar as hand-written code: readability, edge-case handling, consistency with the existing architecture.

## 2. Keep tests as a safety net, not an option

An assistant can hallucinate behavior. Automated tests remain the only reliable proof that the code does what it's supposed to do.

## 3. Document decisions, not code

Generated code already explains *what*. What's often missing is the *why* — the part that stays useful for the next person (human or AI) who touches that file.
