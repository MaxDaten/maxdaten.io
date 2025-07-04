{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  nixConfig = {
    extra-trusted-public-keys =
      "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... }@inputs:
    let forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in {

      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      formatter = forEachSystem (system:
        inputs.treefmt-nix.lib.evalModule nixpkgs.legacyPackages.${system}
          ./treefmt.nix);

      devShells = forEachSystem (system:
        let
          inherit (pkgs) lib;
          pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
          treefmtEval = inputs.treefmt-nix.lib.evalModule pkgs ./treefmt.nix;
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [{
              languages.nix.enable = true;
              languages.javascript = {
                enable = true;
                npm = {
                  enable = true;
                  install.enable = true;
                };
              };
              languages.typescript.enable = true;

              # Git hooks for running tests before commits
              git-hooks.hooks = {
                # Run unit tests
                unit-tests = {
                  enable = true;
                  name = "unit-tests";
                  entry = "npm run test";
                  language = "system";
                  pass_filenames = false;
                };

                # Run E2E tests
                e2e-tests = {
                  enable = true;
                  name = "e2e-tests";
                  entry = "npm run test:e2e";
                  language = "system";
                  pass_filenames = false;
                };

                # Run linting and formatting
                lint-check = {
                  enable = true;
                  name = "lint-check";
                  entry = "npm run lint";
                  language = "system";
                  pass_filenames = false;
                };
              };

              # https://devenv.sh/reference/options/
              packages = [
                pkgs.npm-check-updates
                pkgs.nodePackages.vercel
                pkgs.claude-code
                treefmtEval.config.build.wrapper
              ] ++ lib.attrValues treefmtEval.config.build.programs;

              enterShell = ''
                ${pkgs.figlet}/bin/figlet -f slant "maxdaten.io" | ${pkgs.lolcat}/bin/lolcat
              '';
            }];
          };
        });
    };
}
