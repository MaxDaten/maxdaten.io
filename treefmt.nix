# https://github.com/numtide/treefmt-nix#flakes
{
  pkgs,
  lib,
  config,
  ...
}:
{
  # Used to find the project root
  projectRootFile = "flake.nix";
  programs.nixfmt.enable = true;
  programs.nixfmt.package = pkgs.nixfmt-rfc-style;
  programs.prettier.enable = true;
  programs.prettier.settings = builtins.fromJSON (lib.readFile ./.prettierrc);
  programs.prettier.includes = [
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
}
