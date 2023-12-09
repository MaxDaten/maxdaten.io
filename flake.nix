{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {

      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      formatter = forEachSystem (system:
        inputs.treefmt-nix.lib.evalModule nixpkgs.legacyPackages.${system} ./treefmt.nix
      );

      devShells = forEachSystem
        (system:
          let
            inherit (pkgs) lib;
            pkgs = nixpkgs.legacyPackages.${system};
            treefmtEval = inputs.treefmt-nix.lib.evalModule pkgs ./treefmt.nix;
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  languages.javascript.enable = true;
                  languages.javascript.npm.install.enable = true;
                  languages.nix.enable = true;
                  languages.typescript.enable = true;

                  # https://devenv.sh/reference/options/
                  packages = [
                    treefmtEval.config.build.wrapper
                  ] ++ lib.attrValues treefmtEval.config.build.programs;

                  enterShell = ''
                    ${pkgs.figlet}/bin/figlet "maxdaten.io" | ${pkgs.lolcat}/bin/lolcat
                  '';
                }
              ];
            };
          });
    };
}
