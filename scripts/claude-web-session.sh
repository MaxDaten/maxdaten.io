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

# Fallback for an environment without the setup script (see scripts/claude-web-setup.sh).
[ -f "$HOME/.nix-profile/etc/profile.d/nix.sh" ] && . "$HOME/.nix-profile/etc/profile.d/nix.sh"
if ! command -v devenv >/dev/null; then
  CLAUDE_WEB_SETUP_WARM=0 bash scripts/claude-web-setup.sh >>"$log" 2>&1
  [ -f "$HOME/.nix-profile/etc/profile.d/nix.sh" ] && . "$HOME/.nix-profile/etc/profile.d/nix.sh"
fi
if ! command -v devenv >/dev/null; then
  echo "devenv unavailable in this cloud session; see $log. Tooling from devenv.nix (treefmt, e2e, gate, …) is missing."
  exit 0
fi

# .env is gitignored. These are the public values from CLAUDE.md, not secrets.
[ -f .env ] || printf 'PUBLIC_SANITY_PROJECT_ID=hvsy54ho\nPUBLIC_SANITY_DATASET=production\n' >.env

dump=$(mktemp)
if ! devenv shell -- bash -c 'export -p >"$1"' _ "$dump" >>"$log" 2>&1; then
  echo "devenv shell failed in this cloud session; see $log."
  exit 0
fi
# Drop what belongs to this one process or to Claude Code itself.
grep -v -E '^declare -x (PWD|OLDPWD|SHLVL|_|DEVENV_CMDLINE|CLAUDE_[A-Z_]*)=' "$dump" >>"${CLAUDE_ENV_FILE:?}"
rm -f "$dump"

# Playwright browsers live outside the repo; install them in the background if the setup script
# didn't (needs the Playwright CDN in the environment's allowlist).
if ! ls "$HOME"/.cache/ms-playwright/chromium-* >/dev/null 2>&1; then
  nohup devenv shell -- npx playwright install --with-deps chromium >>/tmp/playwright-install.log 2>&1 &
fi

echo "devenv shell loaded for cloud session (devenv.nix scripts, treefmt and git hooks available)."
