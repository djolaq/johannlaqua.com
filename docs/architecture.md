# Architecture

One repository, three concerns, each in its own place.

```
johannlaqua.com/
├── apps/
│   └── site/                 the Astro website (the only deployable)
├── packages/
│   └── design-system/        tokens, base styles, fonts, visuals, specimen page
├── deploy/                   how the built site reaches a host (scripts + guide)
├── docs/                     architecture, decisions (ADR)
├── .github/workflows/        ci.yml (tests) · deploy.yml (test → build → deploy)
├── .claude/skills/           project skills for AI agents
├── AGENTS.md                 conventions for AI agents
└── package.json              npm workspaces: apps/*, packages/*
```

## Who depends on whom

```
packages/design-system  ◄──  apps/site  ──build──►  dist/  ──►  deploy/ + deploy.yml  ──►  host
```

- **`packages/design-system`** depends on nothing in this repo. It owns every
  visual value (`src/tokens.css`), the base styles, the font packages and the
  geometry of the hero visual. Its `README.md` is the design reference.
- **`apps/site`** imports the design system as a normal package
  (`import '@johannlaqua/design-system'`) and owns content, pages, i18n and tests.
  It never defines a colour or a size of its own.
- **`deploy/`** only sees the built `dist/` folder. It knows nothing about
  Astro; the site knows nothing about the host.

Dependencies go one way only (left to right above). An app never imports
from another app; a package never imports from an app.

## Everyday commands (from the repo root)

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm install`          | Installs every workspace, one lockfile                             |
| `npm run dev`          | Site dev server on http://localhost:4321                           |
| `npm run check`        | Type-checks the site, verifies the design system's generated files |
| `npm test`             | Unit + e2e tests of the site                                       |
| `npm run build`        | Production build into `apps/site/dist/`                            |
| `npm run design:build` | Regenerates `tokens.json` and the exported hero SVG                |

## Where does a change go?

| I want to…                                      | Edit                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| change a colour, font, size, spacing            | `packages/design-system/src/tokens.css` (+ its README changelog) |
| change a base style (`.card`, `.kicker`, tones) | `packages/design-system/src/global.css`                          |
| add or change a page, a component, copy         | `apps/site/src/`                                                 |
| write a post                                    | `apps/site/src/content/blog/{fr,en}/`                            |
| change how or where the site is published       | `deploy/` and `.github/workflows/deploy.yml`                     |
| record why a structural choice was made         | a new file in `docs/adr/`                                        |

## Growing

- A second deployable (a lab demo, a slides site) → `apps/<name>/`.
- Shared code used by more than one app (config, components) → `packages/<name>/`.
  Do not extract a package for a single consumer.
- A build orchestrator (Turborepo, Nx) is not needed at this size; reconsider
  around five packages or when CI time hurts.
