import { describe, expect, it } from 'vitest';
import { highlightCodeBlocks } from './highlight';

const codeBlock = (
    code: string,
    language?: string,
    highlightedLines?: string
) => ({
    _type: 'codeBlock',
    _key: 'k1',
    code,
    language,
    highlightedLines,
});

describe('highlightCodeBlocks', () => {
    it('adds Shiki HTML to code blocks and leaves other blocks untouched', async () => {
        const text = { _type: 'block', _key: 'b1', children: [] };
        const [block, code] = await highlightCodeBlocks([
            text,
            codeBlock('const x = 1;', 'ts'),
        ]);

        expect(block).toBe(text);
        expect(code.highlightedHtml).toMatch(/^<pre class="shiki ayu-dark"/);
        expect(code.highlightedHtml).toContain('style="color:');
    });

    it('marks highlighted lines', async () => {
        const [code] = await highlightCodeBlocks([
            codeBlock('a\nb\nc', 'text', '{2}'),
        ]);

        expect(
            code.highlightedHtml.match(/class="line highlighted"/g)
        ).toHaveLength(1);
    });

    it('falls back to plain text for unknown languages instead of failing the build', async () => {
        const [code] = await highlightCodeBlocks([
            codeBlock('x', 'no-such-language'),
        ]);

        expect(code.highlightedHtml).toContain('<pre class="shiki ayu-dark"');
    });

    it('renders comments with WCAG AA contrast on the code background', async () => {
        const [code] = await highlightCodeBlocks([codeBlock('// note', 'ts')]);

        // ayu-dark's #5A6673 is 3.11:1 on #141519; #7a8693 is 4.92:1.
        expect(code.highlightedHtml.toLowerCase()).not.toContain('#5a6673');
        expect(code.highlightedHtml.toLowerCase()).toContain('color:#7a8693');
    });

    it('handles posts without a body', async () => {
        expect(await highlightCodeBlocks(undefined)).toEqual([]);
    });
});
