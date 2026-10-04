import { describe, expect, it } from 'vitest';
import { heroSummary } from '#lib/i18n/index.js';
import { renderLlmsFullTxt, renderLlmsTxt, type LlmsPost } from './llms';
import type { Author } from '#lib/utils/types.js';

const author: Author = {
    id: 'jloos',
    name: 'Jan-Philip Loos',
    bio: 'Bio.',
    specialties: ['Platform Engineering', 'Nix & devenv'],
    socials: {
        github: 'https://github.com/MaxDaten',
        email: 'mailto:jloos@maxdaten.com',
        signal: 'https://signal.me/#eu/x',
    },
};

const post: LlmsPost = {
    title: 'Ship Your Toolchain',
    slug: 'ship-your-toolchain',
    excerpt: 'Why the toolchain belongs in the repo.',
    date: '2026-01-31',
    body: [
        {
            _type: 'block',
            _key: 'h',
            style: 'h2',
            markDefs: [],
            children: [{ _type: 'span', _key: 's1', text: 'The problem' }],
        },
        {
            _type: 'block',
            _key: 'p',
            style: 'normal',
            markDefs: [
                {
                    _type: 'internalLink',
                    _key: 'l1',
                    reference: { _type: 'post', slug: { current: 'other' } },
                },
            ],
            children: [
                { _type: 'span', _key: 's2', text: 'See ' },
                {
                    _type: 'span',
                    _key: 's3',
                    text: 'the other post',
                    marks: ['l1'],
                },
            ],
        },
        {
            _type: 'codeBlock',
            _key: 'c',
            language: 'nix',
            code: '{ pkgs }: pkgs.hello',
        },
        {
            _type: 'callout',
            _key: 'co',
            content: [
                {
                    _type: 'block',
                    _key: 'cp',
                    style: 'normal',
                    markDefs: [],
                    children: [{ _type: 'span', _key: 's4', text: 'Heads up' }],
                },
            ],
        },
        { _type: 'portableImage', _key: 'i', alt: 'A diagram' },
    ],
};

describe('llms.txt', () => {
    const txt = renderLlmsTxt([post], author);

    it('opens with the name and the site description as summary', () => {
        expect(txt.split('\n').slice(0, 3)).toEqual([
            '# Jan-Philip Loos',
            '',
            `> ${heroSummary('en')}`,
        ]);
    });

    it('lists each post with its canonical URL and excerpt', () => {
        expect(txt).toContain(
            '- [Ship Your Toolchain](https://www.maxdaten.io/ship-your-toolchain): Why the toolchain belongs in the repo.'
        );
    });

    it('keeps a multi-line excerpt on its list item', () => {
        const multiLine = renderLlmsTxt(
            [{ ...post, excerpt: 'First line. \nSecond line.' }],
            author
        );
        expect(multiLine).toContain('): First line. Second line.\n');
    });

    it('links public profiles and the full-text file', () => {
        expect(txt).toContain('(https://github.com/MaxDaten)');
        expect(txt).toContain('(https://www.maxdaten.io/llms-full.txt)');
        expect(txt).not.toContain('signal.me');
    });
});

describe('llms-full.txt', () => {
    const full = renderLlmsFullTxt([post], author);

    it('renders each post body as Markdown under its title and URL', () => {
        expect(full).toContain('# Ship Your Toolchain');
        expect(full).toContain(
            'URL: https://www.maxdaten.io/ship-your-toolchain'
        );
        expect(full).toContain('## The problem');
    });

    it('renders the site-specific blocks and links', () => {
        expect(full).toContain(
            'See [the other post](https://www.maxdaten.io/other)'
        );
        expect(full).toContain('```nix\n{ pkgs }: pkgs.hello\n```');
        expect(full).toContain('> Heads up');
        expect(full).toContain('[Image: A diagram]');
    });
});
