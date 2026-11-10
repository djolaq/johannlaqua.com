# 0001 — One repository with npm workspaces

Date: 2026-11-11 · Status: accepted

## Context

The project has three parts — the site, its design system, its deployment —
maintained by one person. They were mixed in a single Astro project, and a
copy of the design work lived outside git.

## Decision

Keep one repository and split it with npm workspaces: deployables in
`apps/*`, reusable code in `packages/*`, plus `deploy/` and `docs/` at the root.

## Why

- A design change and the site change that uses it land in one commit and one
  PR, tested together. Separate repositories would need versioning and
  publishing a package for a single consumer.
- npm workspaces need no new tool: the repo already uses npm with exact
  versions and one lockfile.
- `apps/` + `packages/` is the layout the JavaScript community has converged
  on, so tools and contributors recognise it.

## Cost

- Paths are one level deeper (`apps/site/src/…`).
- No task orchestrator or caching. Acceptable with two workspaces.
