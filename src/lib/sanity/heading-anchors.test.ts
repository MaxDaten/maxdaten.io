import { describe, expect, it } from 'vitest';
import { assignHeadingAnchors, headingSlug } from './heading-anchors.js';

const heading = (text: string, style = 'h2') => ({
    _type: 'block',
    _key: text,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: 's', text, marks: [] }],
});

describe('headingSlug', () => {
    it.each([
        [
            'OpenSSL: Version Drift in the Fields',
            'openssl-version-drift-in-the-fields',
        ],
        ["What's in a name?", 'whats-in-a-name'],
        ['Übersicht für Größen', 'ubersicht-fur-grossen'],
        ['  Spaces  around  ', 'spaces-around'],
    ])('%s → %s', (text, slug) => {
        expect(headingSlug(text)).toBe(slug);
    });
});

describe('assignHeadingAnchors', () => {
    it('numbers repeated headings', () => {
        const body = assignHeadingAnchors([
            heading('Setup'),
            heading('Usage'),
            heading('Setup', 'h3'),
            heading('Setup'),
        ]);
        expect(body.map((b) => (b as { _anchor?: string })._anchor)).toEqual([
            'setup',
            'usage',
            'setup-2',
            'setup-3',
        ]);
    });

    it('leaves paragraphs and other blocks alone', () => {
        const paragraph = heading('Text', 'normal');
        const code = { _type: 'codeBlock', _key: 'c' };
        expect(assignHeadingAnchors([paragraph, code])).toEqual([
            paragraph,
            code,
        ]);
    });

    it('falls back when a heading has no letters to slug', () => {
        const [block] = assignHeadingAnchors([heading('🚀')]);
        expect((block as { _anchor?: string })._anchor).toBe('section');
    });
});
