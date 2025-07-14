import { describe, test, expect } from 'vitest';
import {
    getFileIcon,
    hasFileIcon,
    getSupportedLanguages,
} from './fileIcons.js';

describe('fileIcons utility', () => {
    test('should return icon for supported languages', () => {
        expect(getFileIcon('js')).toBeTruthy();
        expect(getFileIcon('javascript')).toBeTruthy();
        expect(getFileIcon('ts')).toBeTruthy();
        expect(getFileIcon('typescript')).toBeTruthy();
        expect(getFileIcon('python')).toBeTruthy();
        expect(getFileIcon('svelte')).toBeTruthy();
    });

    test('should return null for unsupported languages', () => {
        expect(getFileIcon('cobol')).toBeNull();
        expect(getFileIcon('fortran')).toBeNull();
        expect(getFileIcon('')).toBeNull();
        expect(getFileIcon(null)).toBeNull();
    });

    test('should be case insensitive', () => {
        expect(getFileIcon('JS')).toBeTruthy();
        expect(getFileIcon('JavaScript')).toBeTruthy();
        expect(getFileIcon('PYTHON')).toBeTruthy();
        expect(getFileIcon('TypeScript')).toBeTruthy();
    });

    test('should handle whitespace', () => {
        expect(getFileIcon(' js ')).toBeTruthy();
        expect(getFileIcon(' python ')).toBeTruthy();
    });

    test('hasFileIcon should work correctly', () => {
        expect(hasFileIcon('js')).toBe(true);
        expect(hasFileIcon('python')).toBe(true);
        expect(hasFileIcon('cobol')).toBe(false);
        expect(hasFileIcon(null)).toBe(false);
    });

    test('getSupportedLanguages should return array of languages', () => {
        const languages = getSupportedLanguages();
        expect(Array.isArray(languages)).toBe(true);
        expect(languages.length).toBeGreaterThan(0);
        expect(languages).toContain('js');
        expect(languages).toContain('python');
        expect(languages).toContain('ts');
    });
});
