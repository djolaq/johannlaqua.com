# 0003 — Build once, choose the host with a variable

Date: 2026-11-11 · Status: accepted

## Context

The site is fully static. It must be deployed from GitHub Actions, but the
host is not chosen yet.

## Decision

`deploy.yml` runs test → build → deploy. The build uploads `dist/` as an
artifact and knows nothing about the host. Each host is a separate job,
enabled by the repository variable `DEPLOY_TARGET`; unset means build only.
Host-specific scripts and the guide live in `deploy/`.

## Why

- Choosing or changing host is a setting plus, at most, one new job.
- What is deployed is exactly what was tested: deploy jobs download the
  artifact, they do not rebuild.
- Secrets are scoped to a GitHub environment and only reach the deploy job.

## Cost

- The `rsync` and `github-pages` jobs are written but have not run against a
  real host; the first deployment must be verified (see `deploy/README.md`).
- Tests run inside `deploy.yml` on `main`, so a push to `main` takes a few
  minutes before publishing.
