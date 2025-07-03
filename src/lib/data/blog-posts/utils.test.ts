import { describe, it, expect } from 'vitest';
import { readingTime } from './utils';

describe('readingTime', () => {
    it('should calculate reading time for short text', () => {
        const text = 'This is a short text with exactly ten words here.';
        const result = readingTime(text);

        expect(result.minutes).toBe(1); // 10 words / 200 words per minute
        expect(result.text).toBe('1 min read');
    });

    it('should calculate reading time for medium text', () => {
        const text = 'word '.repeat(100); // 100 words
        const result = readingTime(text);

        expect(result.minutes).toBe(1); // 100 words / 200 words per minute
        expect(result.text).toBe('1 min read');
    });

    it('should calculate reading time for long text', () => {
        const text = 'word '.repeat(600); // 600 words
        const result = readingTime(text);

        expect(result.minutes).toBe(4); // 600 words / 200 words per minute
        expect(result.text).toBe('4 min read');
    });

    it('should handle empty string', () => {
        const result = readingTime('');

        expect(result.minutes).toBe(1);
        expect(result.text).toBe('1 min read'); // Math.ceil(0) = 0, but min 1
    });

    it('should handle single word', () => {
        const result = readingTime('word');

        expect(result.minutes).toBe(1); // 1 word / 200 words per minute
        expect(result.text).toBe('1 min read');
    });

    it('should handle text with multiple spaces and newlines', () => {
        const text = 'word1   word2\n\nword3\t\tword4     word5';
        const result = readingTime(text);

        expect(result.minutes).toBe(1); // 5 words / 200 words per minute
        expect(result.text).toBe('1 min read');
    });

    it('should round up fractional minutes', () => {
        const text = 'word '.repeat(250); // 250 words = 1.25 minutes
        const result = readingTime(text);

        expect(result.minutes).toBe(2);
        expect(result.text).toBe('2 min read'); // Math.ceil(1.25) = 2
    });

    it('should handle exactly 200 words', () => {
        const text = 'word '.repeat(200); // Exactly 200 words = 1 minute
        const result = readingTime(text);

        expect(result.minutes).toBe(2);
        expect(result.text).toBe('2 min read');
    });
});
