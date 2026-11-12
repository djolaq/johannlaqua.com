#!/usr/bin/env bash
# Uploads a built site to a web host over SSH with rsync, together with
# deploy/apache/.htaccess (caching, compression).
# Usage: deploy/rsync.sh <dist-dir>
# Required env: DEPLOY_SSH_KEY, DEPLOY_SSH_KNOWN_HOSTS, DEPLOY_SSH_HOST,
#               DEPLOY_SSH_USER, DEPLOY_PATH.  Optional: DEPLOY_SSH_PORT (22),
#               DRY_RUN=1 to list changes without writing anything.
set -euo pipefail

dist="${1:?usage: deploy/rsync.sh <dist-dir>}"
: "${DEPLOY_SSH_KEY:?missing}" "${DEPLOY_SSH_KNOWN_HOSTS:?missing}"
: "${DEPLOY_SSH_HOST:?missing}" "${DEPLOY_SSH_USER:?missing}" "${DEPLOY_PATH:?missing}"
port="${DEPLOY_SSH_PORT:-22}"

[[ -f "$dist/index.html" ]] || { echo "No index.html in '$dist' — refusing to deploy." >&2; exit 1; }
# --delete removes remote files that are not in the build: never aim it at a root or home directory.
case "$DEPLOY_PATH" in
  /|"~"|"~/"|.|./|"") echo "DEPLOY_PATH '$DEPLOY_PATH' is too broad — refusing to deploy." >&2; exit 1 ;;
esac

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT
( umask 077; printf '%s\n' "$DEPLOY_SSH_KEY" > "$workdir/key" )
printf '%s\n' "$DEPLOY_SSH_KNOWN_HOSTS" > "$workdir/known_hosts"

# deploy/apache/.htaccess (cache headers, compression) goes up with the build,
# at the web root: as a source of this transfer, --delete keeps it in place.
htaccess="$(dirname "${BASH_SOURCE[0]}")/apache/.htaccess"
[[ -f "$htaccess" ]] || { echo "Missing $htaccess — refusing to deploy." >&2; exit 1; }

rsync --archive --compress --delete --human-readable --itemize-changes \
  ${DRY_RUN:+--dry-run} \
  --rsh "ssh -p $port -i $workdir/key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$workdir/known_hosts" \
  "$dist/" "$htaccess" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST:$DEPLOY_PATH/"
