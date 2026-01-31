{
  pkgs,
  lib,
  config,
  ...
}:
{
  languages.nix.enable = true;
  languages.javascript = {
    enable = true;
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
      entry = "npm run test:e2e -- --project chromium --reporter list";
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

  packages = with pkgs; [
    npm-check-updates
    nodePackages.vercel
  ];

  enterShell = ''
    ${pkgs.figlet}/bin/figlet -f slant "maxdaten.io" | ${pkgs.lolcat}/bin/lolcat
  '';
}
