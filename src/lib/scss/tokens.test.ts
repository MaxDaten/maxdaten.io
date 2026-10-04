import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = new URL('../..', import.meta.url).pathname;

// Exempt by design: the token files define the primitives; satori renders the OG cards and their
// previews without CSS variables; stories are dev-only fixtures.
const EXEMPT = [
    /^lib\/scss\/tokens-[a-z]+\.css$/,
    /^routes\/(\[slug\]\/)?og\.jpg\//,
    /^routes\/og-preview\//,
    /\.stories\.svelte$/,
];

function styleSources(dir = SRC): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return styleSources(path);
        return /\.(svelte|css)$/.test(entry.name) ? [path] : [];
    });
}

const files = styleSources()
    .map((path) => relative(SRC, path))
    .filter((path) => !EXEMPT.some((pattern) => pattern.test(path)));

const blank = (text: string) => text.replace(/[^\n]/g, ' ');

/** Lines of style code in `path` matching `pattern`, as `path:line`. Markup and script outside a
 * component's <style> block and CSS comments are blanked first (keeping line numbers). */
function matches(path: string, pattern: RegExp) {
    let source = readFileSync(join(SRC, path), 'utf8');
    if (path.endsWith('.svelte')) {
        source = source
            .split(/(<style[^>]*>[\s\S]*?<\/style>)/)
            .map((part) => (part.startsWith('<style') ? part : blank(part)))
            .join('');
    }
    return source
        .replace(/\/\*[\s\S]*?\*\//g, blank)
        .split('\n')
        .flatMap((line, index) =>
            pattern.test(line) ? [`${path}:${index + 1}`] : []
        );
}

// Effect internals tuned as one piece (holo foil, glare, ambient blobs, error illustration) keep
// their literals; DESIGN.md documents them as effects, not as reusable tokens.
const EFFECTS = [
    /^lib\/components\/molecules\/HoloCard\.svelte$/,
    /^lib\/components\/organisms\/Bubbles\.svelte$/,
    /^lib\/icons\//,
    /^lib\/scss\/breakpoints\.css$/,
];
const styled = files.filter(
    (path) => !EFFECTS.some((pattern) => pattern.test(path))
);

describe('design tokens', () => {
    it('components take colours from tokens', () => {
        const colour =
            /[:,(\s](#[0-9a-f]{3,8}\b|rgba?\(\s*\d|(black|white)\s*[;)])/i;
        expect(styled.flatMap((path) => matches(path, colour))).toEqual([]);
    });

    it('components take font sizes from the type scale', () => {
        // em stays allowed: inline code sizes itself relative to the surrounding text.
        const size = /font-size:\s*[\d.]+(px|rem)/;
        expect(styled.flatMap((path) => matches(path, size))).toEqual([]);
    });

    it('spacing stays on the 8px grid tokens', () => {
        // Hairline borders and the visually-hidden clip are 1px by definition.
        const spacing =
            /^\s*(padding|margin|gap|grid-gap|row-gap|column-gap)[a-z-]*:[^;]*\b(?!1px\b)\d+(\.\d+)?(px|rem)/;
        expect(styled.flatMap((path) => matches(path, spacing))).toEqual([]);
    });

    it('radii come from the radius tokens', () => {
        const radius = /border-radius:\s*[\d.]+(px|rem)/;
        expect(styled.flatMap((path) => matches(path, radius))).toEqual([]);
    });

    it('transitions name their properties instead of all', () => {
        // `all` also animates layout and the focus ring whenever any property changes.
        const all = /transition(-property)?:\s*all\b/;
        expect(files.flatMap((path) => matches(path, all))).toEqual([]);
    });

    it('every var() names a custom property that is defined somewhere', () => {
        // Definitions: declarations in CSS and style blocks, and style:--name directives in markup.
        const defined = new Set(
            styleSources().flatMap((path) =>
                [
                    ...readFileSync(path, 'utf8').matchAll(
                        /(?:^|[\s{;]|style:)(--[\w-]+)\s*[:=]/g
                    ),
                ].map(([, name]) => name)
            )
        );
        const undefinedRefs = files.flatMap((path) => {
            const source = readFileSync(join(SRC, path), 'utf8').replace(
                /\/\*[\s\S]*?\*\//g,
                ''
            );
            return [...source.matchAll(/var\(\s*(--[\w-]+)/g)]
                .map(([, name]) => name)
                .filter((name) => !defined.has(name))
                .map((name) => `${path}: ${name}`);
        });
        expect(undefinedRefs).toEqual([]);
    });

    it('scans the component and style sources', () => {
        expect(files.length).toBeGreaterThan(20);
    });

    it('components use semantic tokens, never --raw-* primitives', () => {
        const offenders = files.flatMap((path) =>
            readFileSync(join(SRC, path), 'utf8')
                .split('\n')
                .flatMap((line, index) =>
                    /var\(--raw-/.test(line) ? [`${path}:${index + 1}`] : []
                )
        );
        expect(offenders).toEqual([]);
    });
});
