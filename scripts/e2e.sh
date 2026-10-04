#!/usr/bin/env bash
# Run Playwright against a private dev server on a free port.
#
# playwright.config.ts reuses any server already listening on :5173 and honours
# PLAYWRIGHT_BASE_URL, so a stale server (another checkout, another agent) or a variable leaked
# from another project's environment silently tests the wrong code. This script avoids both.
#
# Usage: scripts/e2e.sh [playwright args]   (chromium unless --project is given)
set -euo pipefail
cd "$(dirname "$0")/.."

log=$(mktemp)

# Vite picks the first free port from 5300 up and prints it; reading that back avoids racing
# other checkouts (worktrees) for a port. 5300 keeps clear of `devenv up` (5173 and up).
# Run vite's own binary (not npx) so the PID we kill is the server itself.
env -u PORT -u PLAYWRIGHT_BASE_URL ./node_modules/.bin/vite dev --port 5300 >"$log" 2>&1 &
server=$!
trap 'kill "$server" 2>/dev/null || true; rm -f "$log"' EXIT

url=
for _ in $(seq 1 120); do
    url=$(sed -E 's/\x1b\[[0-9;]*m//g' "$log" | grep -oE 'Local: +http://localhost:[0-9]+' | grep -oE 'http://.*' || true)
    [[ -n $url ]] && break
    kill -0 "$server" 2>/dev/null || break
    sleep 0.5
done
if [[ -z $url ]]; then
    cat "$log"
    echo "e2e: dev server did not start" >&2
    exit 1
fi

project=(--project=chromium)
for arg in "$@"; do [[ $arg == --project* ]] && project=(); done

PLAYWRIGHT_BASE_URL="$url" npx playwright test "${project[@]}" "$@"
