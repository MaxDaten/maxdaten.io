#!/usr/bin/env bash
# Provisions a Claude Code on the web VM (Ubuntu 24.04, root) with devenv, then warms the devenv
# shell so the environment snapshot already holds the toolchain. Idempotent. The cloud image ships
# Nix (nix-installer, flakes enabled); this script only adds what the repo needs on top.
#
# Runs from two places:
#   - the cloud environment's setup script (claude.ai/code → environment → Setup script), which
#     runs before Claude starts and is snapshotted for later sessions. Paste:
#
#       #!/bin/bash
#       s=$(find / -maxdepth 5 -path '*/scripts/claude-web-setup.sh' -not -path '/proc/*' -not -path '/nix/*' 2>/dev/null | head -1)
#       [ -n "$s" ] && bash "$s" || true
#
#   - scripts/claude-web-session.sh, as a fallback when the setup script never ran.
#
# Network (cloud environment → Custom, with the default list included): *.nixos.org, GitHub and npm
# are in the defaults; also allow *.sanity.io (content for dev/build/tests), cdn.playwright.dev and
# playwright.download.prss.microsoft.com (browsers for e2e/browser tests), *.cachix.org (devenv's
# binary cache; optional, avoids slow lookups).
set -uo pipefail

repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
log() { echo "[claude-web-setup] $*" >&2; }

# Puts ~/.nix-profile/bin (where devenv lands) on PATH; the image only has the default profile.
# shellcheck disable=SC1091
. /nix/var/nix/profiles/default/etc/profile.d/nix.sh
command -v nix >/dev/null || {
  log "Nix missing: this script expects the Claude Code on the web image, which ships it"
  exit 1
}

# Locked github inputs can't be downloaded here; scripts/claude-web-devenv.sh fetches them over
# git instead and runs devenv with them as overrides. Fetch them now so the snapshot holds them.
devenv=(bash "$repo/scripts/claude-web-devenv.sh")
for name in $(jq -r '.nodes[.root].inputs | keys[]' "$repo/devenv.lock"); do
  "${devenv[@]}" --store-path "$name" >/dev/null || log "could not fetch input $name"
done

# devenv from the repo's pinned nixpkgs, so the CLI matches what devenv.lock was made with.
if ! command -v devenv >/dev/null; then
  nixpkgs=$("${devenv[@]}" --store-path nixpkgs) || exit 1
  log "installing devenv from $nixpkgs"
  nix profile add "path:$nixpkgs#devenv" || {
    log "devenv install failed"
    exit 1
  }
fi

# Warm the snapshot: build the shell (node, treefmt, prek, …), fill the npm cache and install the
# Playwright browser + its system libraries. Bounded so setup stays under the ~5 min cache limit.
if [ "${CLAUDE_WEB_SETUP_WARM:-1}" = 1 ]; then
  log "warming devenv shell"
  (cd "$repo" && timeout 180 "${devenv[@]}" shell -- npx playwright install --with-deps chromium) >&2 ||
    log "warm-up incomplete (fine: the session hook finishes it)"
fi
exit 0
