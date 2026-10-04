import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const read = (path: string | URL) => readFileSync(path, 'utf8');

/** Family names declared by the @font-face rules that fonts.ts imports. */
const loadedFamilies = (() => {
    const imports = [...read(new URL('./fonts.ts', import.meta.url)).matchAll(/^import '([^']+)';/gm)];
    const families = new Set<string>();
    for (const [, specifier] of imports) {
        const css = read(require.resolve(specifier));
        for (const [, family] of css.matchAll(/font-family:\s*'([^']+)'/g)) families.add(family);
    }
    return families;
})();

/** The first family of each font token: the face the site expects to render. */
const fontTokens = [
    ...read(new URL('./variables.css', import.meta.url)).matchAll(/(--font[\w-]*):\s*'([^']+)'/g),
].map(([, token, family]) => ({ token, family }));

describe('font tokens', () => {
    it('finds the tokens and the loaded faces', () => {
        expect(fontTokens.length).toBeGreaterThan(0);
        expect(loadedFamilies.size).toBeGreaterThan(0);
    });

    it.each(fontTokens)('$token names a face that fonts.ts loads ($family)', ({ family }) => {
        expect([...loadedFamilies]).toContain(family);
    });
});
