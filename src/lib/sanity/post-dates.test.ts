import { describe, expect, it } from 'vitest';
import { postModifiedAt } from './post-dates.js';

describe('postModifiedAt', () => {
    const date = '2026-01-31T12:00:00.000Z';
    const _updatedAt = '2026-02-04T18:44:11Z';
    const lastModified = '2026-03-01T00:00:00.000Z';

    it('prefers the editor-set lastModified', () => {
        expect(postModifiedAt({ date, _updatedAt, lastModified })).toBe(
            lastModified
        );
    });

    it('falls back to the last document edit', () => {
        expect(postModifiedAt({ date, _updatedAt, lastModified: null })).toBe(
            _updatedAt
        );
    });

    it('falls back to the publish date', () => {
        expect(postModifiedAt({ date })).toBe(date);
    });
});
