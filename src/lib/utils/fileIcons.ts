/**
 * Utility for mapping programming languages to Catppuccin VSCode Icons
 * Icons sourced from: https://github.com/catppuccin/vscode-icons
 */

import jsIcon from 'catppuccin-vsc-icons/icons/mocha/javascript.svg?raw';
import tsIcon from 'catppuccin-vsc-icons/icons/mocha/typescript.svg?raw';
import pythonIcon from 'catppuccin-vsc-icons/icons/mocha/python.svg?raw';
import rustIcon from 'catppuccin-vsc-icons/icons/mocha/rust.svg?raw';
import goIcon from 'catppuccin-vsc-icons/icons/mocha/go.svg?raw';
import svelteIcon from 'catppuccin-vsc-icons/icons/mocha/svelte.svg?raw';
import dockerIcon from 'catppuccin-vsc-icons/icons/mocha/docker.svg?raw';
import yamlIcon from 'catppuccin-vsc-icons/icons/mocha/yaml.svg?raw';
import bashIcon from 'catppuccin-vsc-icons/icons/mocha/bash.svg?raw';
import cssIcon from 'catppuccin-vsc-icons/icons/mocha/css.svg?raw';
import sassIcon from 'catppuccin-vsc-icons/icons/mocha/sass.svg?raw';
import htmlIcon from 'catppuccin-vsc-icons/icons/mocha/html.svg?raw';
import jsonIcon from 'catppuccin-vsc-icons/icons/mocha/json.svg?raw';
import markdownIcon from 'catppuccin-vsc-icons/icons/mocha/markdown.svg?raw';
import textIcon from 'catppuccin-vsc-icons/icons/mocha/text.svg?raw';
import nixIcon from 'catppuccin-vsc-icons/icons/mocha/nix.svg?raw';
import haskellIcon from 'catppuccin-vsc-icons/icons/mocha/haskell.svg?raw';
import terraformIcon from 'catppuccin-vsc-icons/icons/mocha/terraform.svg?raw';

// Language to icon mapping
const LANGUAGE_ICON_MAP: Record<string, string> = {
    // JavaScript/TypeScript
    js: jsIcon,
    javascript: jsIcon,
    typescript: tsIcon,
    ts: tsIcon,

    // Python
    python: pythonIcon,
    py: pythonIcon,

    // Other languages
    rust: rustIcon,
    go: goIcon,
    svelte: svelteIcon,

    // Infrastructure/Config
    docker: dockerIcon,
    dockerfile: dockerIcon,
    yaml: yamlIcon,
    yml: yamlIcon,

    // Shell/Bash
    bash: bashIcon,
    sh: bashIcon,
    shell: bashIcon,

    // Web technologies
    html: htmlIcon,
    css: cssIcon,
    scss: sassIcon,
    sass: sassIcon,

    // Others
    http: jsIcon,
    json: jsonIcon,
    text: textIcon,
    txt: textIcon,
    markdown: markdownIcon,
    md: markdownIcon,

    nix: nixIcon,
    haskell: haskellIcon,
    terraform: terraformIcon,
    tf: terraformIcon,
    hcl: terraformIcon,
};

/**
 * Get the SVG icon content for a given programming language
 * @param lang - The programming language identifier
 * @returns SVG content as string or null if no icon found
 */
export function getFileIcon(lang: string | null): string | null {
    if (!lang) return null;

    const normalizedLang = lang.toLowerCase().trim();
    return LANGUAGE_ICON_MAP[normalizedLang] || null;
}

/**
 * Get a list of all supported languages that have icons
 * @returns Array of supported language identifiers
 */
export function getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_ICON_MAP);
}

/**
 * Check if a language has an available icon
 * @param lang - The programming language identifier
 * @returns true if icon is available, false otherwise
 */
export function hasFileIcon(lang: string | null): boolean {
    return getFileIcon(lang) !== null;
}
