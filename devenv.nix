{
  pkgs,
  lib,
  config,
  ...
}:
let
  # The main checkout serves maxdaten.localhost; a git worktree (e.g. .claude/worktrees/<name>)
  # gets <name>.maxdaten.localhost, so checkouts don't collide in devenv's shared proxy.
  checkout = baseNameOf config.devenv.root;
  hostname =
    if checkout == "maxdaten.io" then
      "maxdaten.localhost"
    else
      "${lib.replaceStrings [ "." "_" ] [ "-" "-" ] (lib.toLower checkout)}.maxdaten.localhost";
in
{
  dotenv.enable = true;

  languages.nix.enable = true;
  languages.javascript = {
    enable = true;
    # Keep in sync with engines.node in package.json (CI and Vercel read that).
    package = pkgs.nodejs_24;
    npm = {
      enable = true;
      install.enable = true;
    };
  };
  languages.typescript.enable = true;

  git-hooks.hooks = {
    treefmt.enable = true;

    lint-check = {
      enable = true;
      name = "lint-check";
      entry = "npm run lint";
      language = "system";
      pass_filenames = false;
    };

    svelte-check = {
      enable = true;
      name = "svelte-check";
      entry = "npm run check";
      language = "system";
      pass_filenames = false;
    };

    unit-tests = {
      enable = true;
      name = "unit-tests";
      entry = "npm run test";
      language = "system";
      pass_filenames = false;
    };

    e2e-tests = {
      enable = true;
      name = "e2e-tests";
      # A private dev server, not whatever already listens on :5173 (see scripts/e2e.sh).
      entry = "bash scripts/e2e.sh --reporter list";
      language = "system";
      pass_filenames = false;
      stages = [ "pre-push" ];
    };

    npm-audit = {
      enable = true;
      name = "npm-audit";
      entry = "npm audit --audit-level=high";
      language = "system";
      pass_filenames = false;
      stages = [ "pre-push" ];
    };
  };

  treefmt = {
    enable = true;
    config.programs.nixfmt.enable = true;
    config.programs.prettier.enable = true;
    config.programs.prettier.settings = builtins.fromJSON (lib.readFile ./.prettierrc);
    config.programs.prettier.includes = [
      "*.cjs"
      "*.css"
      "*.html"
      "*.js"
      "*.json"
      "*.json5"
      "*.jsx"
      "*.md"
      "*.mdx"
      "*.mjs"
      "*.scss"
      "*.ts"
      "*.tsx"
      "*.vue"
      "*.yaml"
      "*.yml"
      "*.svelte"
    ];
  };

  # devenv runs a whole-repo treefmt on every shell entry, silently rewriting unrelated
  # files. Formatting is enforced on staged files by the treefmt git hook instead.
  tasks."devenv:treefmt:run".before = lib.mkForce [ ];

  # `devenv up` serves the dev server at http://<hostname> (see above) through devenv's local
  # proxy, whatever port it ends up on (5173 or the next free one).
  process.proxy.enable = true;
  processes.web = {
    exec = "vite dev --port $PORT --strictPort";
    ports.http.allocate = 5173;
    env.PORT = toString config.processes.web.ports.http.value;
    proxy.hostname = hostname;
  };

  scripts = {
    e2e = {
      exec = ''bash "$DEVENV_ROOT/scripts/e2e.sh" "$@"'';
      description = "Playwright (chromium) against a private dev server on a free port";
    };
    smoke = {
      exec = ''cd "$DEVENV_ROOT" && npm run build && node scripts/smoke-vercel-functions.mjs'';
      description = "Build, then check the Vercel output (prerendered OG images, function bundle)";
    };
    gate = {
      exec = ''bash "$DEVENV_ROOT/scripts/gate.sh"'';
      description = "Everything CI checks: format, lint, check, unit, build, smoke, e2e";
    };
    prod-check = {
      exec = ''node "$DEVENV_ROOT/scripts/prod-check.mjs"'';
      description = "After a deploy: redirects, lang/canonical, headers, OG images, llms.txt on production";
    };
  };

  packages = with pkgs; [
    npm-check-updates
  ];

  enterShell = ''
    ${pkgs.figlet}/bin/figlet -f slant "maxdaten.io" | ${pkgs.lolcat}/bin/lolcat
  '';
}
