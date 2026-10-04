#!/usr/bin/env bash
# Project status line: the global one (if any), plus the dev server URL while `devenv up` serves it.
input=$(cat)

global=~/.claude/statusline-command
if [[ -x $global ]]; then
    out=$(printf '%s' "$input" | "$global")
    printf '%s\n' "$out"
fi

dir=$(jq -r '.workspace.project_dir // .cwd' <<<"$input")
root=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null) || exit 0
name=$(basename "$root")

# Same rule as the proxy hostname in devenv.nix: the main checkout is maxdaten.localhost, a
# worktree is <name>.maxdaten.localhost.
if [[ $name == maxdaten.io ]]; then
    host=maxdaten.localhost
else
    host="$(tr 'A-Z._' 'a-z--' <<<"$name").maxdaten.localhost"
fi

# devenv's proxy answers 502 (or nothing) when the dev server isn't running.
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 0.5 "http://$host/")
if [[ $code == 2* || $code == 3* ]]; then
    printf '\033[32m●\033[0m dev http://%s\n' "$host"
fi
