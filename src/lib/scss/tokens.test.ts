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

describe('design tokens', () => {
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
