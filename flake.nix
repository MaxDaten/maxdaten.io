{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    {
      self,
      nixpkgs,
      devenv,
      systems,
      ...
    }@inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
      treefmtEval = forEachSystem (
        system: inputs.treefmt-nix.lib.evalModule nixpkgs.legacyPackages.${system} ./treefmt.nix
      );
    in
    {

      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      formatter = forEachSystem (system: treefmtEval.${system}.config.build.wrapper);

      devShells = forEachSystem (
        system:
        let
          inherit (pkgs) lib;
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };

        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
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

                # Git hooks for running tests before commits
                git-hooks.hooks = {
                  # Run linting and formatting
                  lint-check = {
                    enable = true;
                    name = "00-lint-check";
                    entry = "npm run lint";
                    language = "system";
                    pass_filenames = false;
                  };

                  # Run unit tests
                  unit-tests = {
                    enable = true;
                    name = "01-unit-tests";
                    entry = "npm run test";
                    language = "system";
                    pass_filenames = false;
                  };

                  # Run E2E tests
                  e2e-tests = {
                    enable = true;
                    name = "02-e2e-tests";
                    entry = "npm run test:e2e";
                    language = "system";
                    pass_filenames = false;
                  };

                  # NPM audit high
                  npm-audit = {
                    enable = true;
                    name = "03-npm-audit";
                    entry = "npm audit --audit-level=high";
                    language = "system";
                    pass_filenames = false;
                  };

                };

                # https://devenv.sh/reference/options/
                packages =
                  with pkgs;
                  [
                    npm-check-updates
                    nodePackages.vercel
                    claude-code
                    treefmtEval.${system}.config.build.wrapper

                    # required by zen mcp
                    uv

                    # VSCode with Frontmatter extension
                    (vscode-with-extensions.override {
                      vscodeExtensions =
                        with vscode-extensions;
                        [
                          eamodio.gitlens
                        ]
                        ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
                          {
                            name = "vscode-front-matter";
                            publisher = "eliostruyf";
                            version = "10.9.0";
                            sha256 = "sha256-XrLN227AFiSLZTey1q62ZFEqr0w3VFjUtj76THPIqL8=";
                          }
                        ];
                    })
                  ]
                  ++ lib.attrValues treefmtEval.${system}.config.build.programs;

                enterShell = ''
                  ${pkgs.figlet}/bin/figlet -f slant "maxdaten.io" | ${pkgs.lolcat}/bin/lolcat
                '';
              }
            ];
          };
        }
      );
    };
}
