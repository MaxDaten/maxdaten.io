#!/usr/bin/env bash
# Provisions a Claude Code on the web VM (Ubuntu 24.04, root) with Nix + devenv, then warms the
# devenv shell so the environment snapshot already holds the toolchain. Idempotent.
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
nix_version=2.35.2
log() { echo "[claude-web-setup] $*" >&2; }

# Single-user Nix as root: no nixbld group, no daemon (the VM may not run systemd).
if ! [ -x "$HOME/.nix-profile/bin/nix" ]; then
  log "installing Nix $nix_version"
  mkdir -p /etc/nix
  cat >/etc/nix/nix.conf <<'EOF'
experimental-features = nix-command flakes
build-users-group =
sandbox = false
ssl-cert-file = /etc/ssl/certs/ca-certificates.crt
connect-timeout = 5
fallback = true
EOF
  curl -fsSL "https://releases.nixos.org/nix/nix-$nix_version/install" |
    sh -s -- --no-daemon --yes --no-channel-add || {
    log "Nix install failed"
    exit 1
  }
fi
# shellcheck disable=SC1091
. "$HOME/.nix-profile/etc/profile.d/nix.sh"

# Nix fetches locked github inputs from api.github.com, which the session's GitHub proxy only serves
# for repositories attached to the session. codeload.github.com is allowed: prefetch every locked
# input from there. Same NAR hash, same store path, so Nix never asks the API.
jq -r '.nodes[] | .locked | select(.type == "github") | "\(.owner)/\(.repo) \(.rev) \(.narHash)"' \
  "$repo/devenv.lock" | while read -r slug rev hash; do
  got=$(nix flake prefetch --json "tarball+https://codeload.github.com/$slug/tar.gz/$rev" | jq -r .hash) &&
    [ "$got" = "$hash" ] || log "prefetch mismatch for $slug@$rev: got $got, want $hash"
done

# devenv from the repo's pinned nixpkgs, so the CLI matches what devenv.lock was made with.
if ! command -v devenv >/dev/null; then
  pin=$(jq -r '.nodes[.nodes.root.inputs.nixpkgs].locked | "github:\(.owner)/\(.repo)/\(.rev)?narHash=\(.narHash | @uri)"' "$repo/devenv.lock")
  log "installing devenv from $pin"
  nix profile add "$pin#devenv" || {
    log "devenv install failed"
    exit 1
  }
fi

# Warm the snapshot: build the shell (node, treefmt, prek, …), fill the npm cache and install the
# Playwright browser + its system libraries. Bounded so setup stays under the ~5 min cache limit.
if [ "${CLAUDE_WEB_SETUP_WARM:-1}" = 1 ]; then
  log "warming devenv shell"
  (cd "$repo" && timeout 180 devenv shell -- npx playwright install --with-deps chromium) >&2 ||
    log "warm-up incomplete (fine: the session hook finishes it)"
fi
exit 0
