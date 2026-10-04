#!/usr/bin/env bash
# Provisions a Claude Code on the web VM with devenv, then warms the devenv shell so the environment
# snapshot already holds the toolchain. Idempotent.
#
# Runs from two places:
#   - the cloud environment's setup script (claude.ai/code → environment → Setup script), which
#     runs before Claude starts and is snapshotted for later sessions. Paste:
#
#       #!/bin/bash
#       s=$(find / -maxdepth 5 -path '*/scripts/claude-web-setup.sh' -not -path '/proc/*' -not -path '/nix/*' 2>/dev/null | head -1)
#       [ -n "$s" ] && bash "$s" || true
#
#   - scripts/claude-web-session.sh, when the session has no devenv (setup script not configured).
#
# Network (cloud environment → Custom, with the default list included): *.nixos.org, GitHub and npm
# are in the defaults; also allow *.sanity.io (content for dev/build/tests), cdn.playwright.dev and
# playwright.download.prss.microsoft.com (browsers for e2e/browser tests), *.cachix.org (devenv's
# binary cache; optional, avoids slow lookups).
set -uo pipefail

repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
log() { echo "[claude-web-setup] $*" >&2; }

# The image ships Nix; its nix.sh also puts ~/.nix-profile/bin (where devenv lands) on PATH.
# nix.sh only sets up PATH when USER is set, and cloud sessions leave it unset.
export USER=${USER:-$(id -un)}
# shellcheck disable=SC1091
. /nix/var/nix/profiles/default/etc/profile.d/nix.sh || exit 1

# Locked github inputs can't be downloaded here; claude-web-devenv.sh fetches them over git and
# runs devenv with them as overrides. devenv itself comes from the repo's pinned nixpkgs.
devenv=(bash "$repo/scripts/claude-web-devenv.sh")
if ! command -v devenv >/dev/null; then
  nixpkgs=$("${devenv[@]}" --store-path nixpkgs) || exit 1
  log "installing devenv from $nixpkgs"
  nix profile add "path:$nixpkgs#devenv" || exit 1
fi

# Warm the snapshot: fetch the inputs, build the shell (node, treefmt, prek, …), fill the npm cache
# and install the Playwright browser. Bounded so setup stays under the ~5 min cache limit.
log "warming devenv shell"
(cd "$repo" && timeout 180 "${devenv[@]}" shell -- npx playwright install --with-deps chromium) >&2 ||
  log "warm-up incomplete"
