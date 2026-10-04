import { describe, expect, it } from 'vitest';
import { internalLinkPath } from './internal-link.js';

describe('internalLinkPath', () => {
    it('links a post to its page', () => {
        expect(
            internalLinkPath({ _type: 'post', slug: { current: 'a-post' } })
        ).toBe('/a-post');
    });

    it('links a gem to its card on /gems', () => {
        expect(
            internalLinkPath({ _type: 'gem', slug: { current: 'a-gem' } })
        ).toBe('/gems#a-gem');
    });

    it('has no path for a missing reference', () => {
        expect(internalLinkPath(undefined)).toBeUndefined();
        expect(internalLinkPath({ _type: 'post' })).toBeUndefined();
    });
});
