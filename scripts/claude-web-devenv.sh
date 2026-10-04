#!/usr/bin/env bash
# devenv for Claude Code on the web. The session's GitHub proxy refuses archive downloads
# (codeload.github.com, api.github.com, github.com/…/archive) for repositories not attached to the
# session, and that is how Nix fetches `github:` inputs. Plain git over HTTPS is allowed. So each
# root input of devenv.lock is fetched with a shallow git clone (same tree, same NAR hash, same
# store path) and handed to devenv as `--override-input NAME path:/nix/store/…`. Transitive inputs
# are never forced by this repo's devenv.nix. Overrides make devenv rewrite devenv.lock; the
# original is put back when devenv exits.
#
#   claude-web-devenv.sh [devenv args]     run devenv with the overrides
#   claude-web-devenv.sh --store-path NAME print the store path of root input NAME, fetching it
set -uo pipefail

repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
lock=$repo/devenv.lock
log() { echo "[claude-web-devenv] $*" >&2; }

# Store path of a locked input, computed offline from its NAR hash; fetched over git if missing.
store_path() { # slug rev narHash
  local path got
  path=$(nix-store --print-fixed-path --recursive sha256 \
    "$(nix hash convert --hash-algo sha256 --to nix32 "$3")" source) || return 1
  nix-store --check-validity "$path" 2>/dev/null && {
    echo "$path"
    return
  }
  got=$(nix flake prefetch --json "git+https://github.com/$1?rev=$2&shallow=1" | jq -r .hash) || return 1
  [ "$got" = "$3" ] || {
    log "hash mismatch for $1@$2: got $got, want $3"
    return 1
  }
  echo "$path"
}

# name slug rev narHash dir, for every root input locked to GitHub
root_inputs() {
  jq -r '.nodes as $n | $n[.root].inputs | to_entries[] | select(.value | type == "string")
    | .key as $k | $n[.value].locked | select(.type == "github")
    | "\($k) \(.owner)/\(.repo) \(.rev) \(.narHash) \(.dir // "")"' "$lock"
}

if [ "${1:-}" = --store-path ]; then
  while read -r name slug rev hash _; do
    [ "$name" = "${2:?input name}" ] || continue
    store_path "$slug" "$rev" "$hash"
    exit
  done < <(root_inputs)
  log "no fetchable root input $2 in devenv.lock"
  exit 1
fi

overrides=()
while read -r name slug rev hash dir; do
  path=$(store_path "$slug" "$rev" "$hash") || continue
  overrides+=(--override-input "$name" "path:$path${dir:+?dir=$dir}")
done < <(root_inputs)

backup=$(mktemp)
cp "$lock" "$backup"
restore() {
  cmp -s "$lock" "$backup" || cp "$backup" "$lock"
  rm -f "$backup"
}
trap restore EXIT
trap 'exit 130' INT TERM
command devenv "${overrides[@]}" "$@"
