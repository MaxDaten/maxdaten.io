import { describe, expect, it } from 'vitest';
import { toListingPost } from './listing';

describe('toListingPost()', () => {
    it('flattens tag references to their names and keeps the card fields', () => {
        expect(
            toListingPost({
                slug: 'a-post',
                title: 'A Post',
                excerpt: 'Short.',
                date: '2026-01-31',
                tags: [
                    { name: 'Nix', slug: 'nix' },
                    { name: 'devenv', slug: 'devenv' },
                ],
                coverImage: { url: 'https://cdn.sanity.io/x.jpg', alt: 'X' },
            })
        ).toEqual({
            slug: 'a-post',
            title: 'A Post',
            excerpt: 'Short.',
            date: '2026-01-31',
            tags: ['Nix', 'devenv'],
            coverImage: { url: 'https://cdn.sanity.io/x.jpg', alt: 'X' },
        });
    });

    it('gives a post without tags an empty tag list', () => {
        expect(
            toListingPost({ slug: 's', title: 'T', date: '2026-01-01' }).tags
        ).toEqual([]);
    });
});
