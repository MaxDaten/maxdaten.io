# https://github.com/numtide/treefmt-nix#flakes
{ pkgs, config, ... }:
{
  # Used to find the project root
  projectRootFile = "flake.nix";
  programs.nixfmt.enable = true;
  programs.prettier.enable = true;
}
