#!/usr/bin/env bash
# shellcheck disable=SC1091,SC2016  # nix.sh exists only at runtime; $1 expands in the inner bash
# SessionStart hook (.claude/settings.json): gives Claude Code on the web the same environment
# direnv gives a local shell. Enters the devenv shell once (runs its tasks: npm install, git hooks,
# .claude/ symlinks) and writes the exported environment to $CLAUDE_ENV_FILE, which Claude Code
# sources before every Bash command. A no-op outside cloud sessions.
set -uo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = true ] || exit 0

repo=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}
cd "$repo" || exit 0
log=/tmp/claude-web-session.log
: >"$log"

# nix.sh only sets up PATH when USER is set, and cloud sessions leave it unset.
export USER=${USER:-$(id -un)}
. /nix/var/nix/profiles/default/etc/profile.d/nix.sh 2>/dev/null
command -v devenv >/dev/null || bash scripts/claude-web-setup.sh >>"$log" 2>&1
if ! command -v devenv >/dev/null; then
  echo "devenv unavailable in this cloud session; see $log. Tooling from devenv.nix (treefmt, e2e, gate, …) is missing."
  exit 0
fi

# .env is gitignored. These are the public values from CLAUDE.md, not secrets.
[ -f .env ] || printf 'PUBLIC_SANITY_PROJECT_ID=hvsy54ho\nPUBLIC_SANITY_DATASET=production\n' >.env

dump=$(mktemp)
devenv=(bash scripts/claude-web-devenv.sh)
if ! "${devenv[@]}" shell -- bash -c 'export -p >"$1"' _ "$dump" >>"$log" 2>&1; then
  echo "devenv shell failed in this cloud session; see $log."
  exit 0
fi
# Drop what belongs to this one process or to Claude Code itself.
grep -v -E '^declare -x (PWD|OLDPWD|SHLVL|_|DEVENV_CMDLINE|CLAUDE_[A-Z_]*)=' "$dump" >>"${CLAUDE_ENV_FILE:?}"
rm -f "$dump"
# Plain `devenv` (devenv up, …) can't fetch the locked inputs here either; route it via the wrapper.
printf 'devenv() { bash %q/scripts/claude-web-devenv.sh "$@"; }\n' "$repo" >>"$CLAUDE_ENV_FILE"

echo "devenv shell loaded for cloud session (devenv.nix scripts, treefmt and git hooks available)."
