# Deployment

The site is a folder of static files (`apps/site/dist/`). Any static host can
serve it; **no host is chosen yet**, so the pipeline is built to make that
choice a one-line setting rather than a rewrite.

## How it works

`.github/workflows/deploy.yml`, on every push to `main` (or run manually):

1. **Test** — runs the whole CI (`ci.yml`): types, unit, e2e.
2. **Build** — `npm run build`, then uploads the result as the `site-dist`
   artifact. This step knows nothing about the host.
3. **Deploy** — one job per target, enabled by the repository variable
   `DEPLOY_TARGET`. Unset means "build only": nothing is published and the
   artifact can be downloaded from the run page.

The deploy jobs never rebuild: they publish exactly the files that were tested.

## Choosing a host

Set `DEPLOY_TARGET` in *Settings → Secrets and variables → Actions → Variables*.

### `rsync` — classic web hosting over SSH (e.g. Infomaniak)

Runs [`rsync.sh`](rsync.sh). Create a `production` environment
(*Settings → Environments*) and add these **secrets** to it:

| Secret | Value |
|---|---|
| `DEPLOY_SSH_HOST` | SSH host name of the hosting |
| `DEPLOY_SSH_USER` | SSH user |
| `DEPLOY_PATH` | Absolute path of the site's web root on the host |
| `DEPLOY_SSH_KEY` | Private key of a key pair created **only** for this deployment |
| `DEPLOY_SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -p <port> <host>`, checked against the host's published fingerprint |

Optional variable: `DEPLOY_SSH_PORT` (default 22).

`rsync --delete` mirrors the build: files on the host that are not in the
build are removed. Point `DEPLOY_PATH` at a folder that contains nothing but
this site. Try it first from your machine with `DRY_RUN=1 deploy/rsync.sh apps/site/dist`.

### `github-pages`

In *Settings → Pages*, set the source to "GitHub Actions" and add the custom
domain. No secret needed.

### Another host (Cloudflare Pages, Netlify, S3…)

Add a `deploy-<host>` job to `deploy.yml` with
`if: vars.DEPLOY_TARGET == '<host>'` and `needs: build`, that downloads
`site-dist` and uploads it with the host's CLI or action. Nothing else changes.

## Status

- [ ] Host chosen
- [ ] `DEPLOY_TARGET` set, secrets added
- [ ] First deployment verified (the `rsync` and `github-pages` jobs have not run against a real host yet)
- [ ] DNS for johannlaqua.com pointed at the host, HTTPS checked
- [ ] Security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`) configured on the host
