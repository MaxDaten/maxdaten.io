import { describe, expect, it, vi } from 'vitest';

// image.ts runs in the browser (cards, post images). Building image URLs needs only the project id
// and dataset, so it must not drag the full Sanity client into the client bundle.
vi.mock('@sanity/client', () => {
    throw new Error('image.ts must not import @sanity/client');
});

describe('urlFor', () => {
    it('builds CDN image URLs without the Sanity client', async () => {
        const { urlFor } = await import('./image.js');
        const url = urlFor({
            asset: { _ref: 'image-abc123-1200x800-png' },
        })
            .width(400)
            .auto('format')
            .url();
        expect(url).toMatch(
            /^https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/abc123-1200x800\.png\?w=400&auto=format$/
        );
    });
});
