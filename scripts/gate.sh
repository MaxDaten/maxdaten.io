#!/usr/bin/env bash
# Everything CI checks, in CI's order: one line per stage, stops at the first failure and shows
# its output.
set -uo pipefail
cd "$(dirname "$0")/.."

run() {
    local name=$1
    shift
    local out
    out=$("$@" 2>&1)
    local rc=$?
    if [[ $rc -eq 0 ]]; then
        printf 'ok    %s\n' "$name"
    else
        printf 'FAIL  %s\n' "$name"
        echo "$out" | tail -40
        exit "$rc"
    fi
}

# Tracked files only, as on CI's clean checkout: local build output (e.g. studio/dist) is ignored.
format() { git ls-files -z | xargs -0 npx prettier --check --ignore-unknown; }
run format format
run lint npm run lint
run check npm run check
run unit npm run test
run build npm run build
run smoke node scripts/smoke-vercel-functions.mjs
run e2e scripts/e2e.sh --reporter=line
