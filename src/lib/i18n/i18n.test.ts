import { describe, it, expect } from 'vitest';
import {
    t,
    getLocaleFromPath,
    isTranslatedRoute,
    defaultLocale,
    supportedLocales,
} from './index';
import { de } from './de';
import { en } from './en';
import type { TranslationKeys } from './types';

describe('i18n', () => {
    describe('t()', () => {
        it('returns the English string for locale "en"', () => {
            expect(t('en', 'hero.ctaBook')).toBe('Book a Call');
        });

        it('returns the German string for locale "de"', () => {
            expect(t('de', 'hero.ctaBook')).toBe('Gespräch buchen');
        });

        it('returns different values per locale for translated keys', () => {
            // Keys that are intentionally the same in both languages
            const sameInBothLocales = new Set([
                'nav.blog',
                'nav.gems',
                'footer.impressum',
            ]);

            for (const key of Object.keys(de) as (keyof TranslationKeys)[]) {
                if (sameInBothLocales.has(key)) continue;
                expect(
                    t('de', key),
                    `key "${key}" should differ between locales`
                ).not.toBe(t('en', key));
            }
        });

        it('has the same keys in both locales', () => {
            const deKeys = Object.keys(de).sort();
            const enKeys = Object.keys(en).sort();
            expect(deKeys).toEqual(enKeys);
        });
    });

    describe('getLocaleFromPath()', () => {
        it('returns "en" for /en', () => {
            expect(getLocaleFromPath('/en')).toBe('en');
        });

        it('returns "en" for /en/', () => {
            expect(getLocaleFromPath('/en/')).toBe('en');
        });

        it('returns "en" for /en/something', () => {
            expect(getLocaleFromPath('/en/something')).toBe('en');
        });

        it('returns "de" for /', () => {
            expect(getLocaleFromPath('/')).toBe('de');
        });

        it('returns "de" for /blog', () => {
            expect(getLocaleFromPath('/blog')).toBe('de');
        });

        it('returns "de" for /gems', () => {
            expect(getLocaleFromPath('/gems')).toBe('de');
        });

        it('does not match /enterprise as "en"', () => {
            expect(getLocaleFromPath('/enterprise')).toBe('de');
        });
    });

    describe('isTranslatedRoute()', () => {
        it('returns true for /', () => {
            expect(isTranslatedRoute('/')).toBe(true);
        });

        it('returns true for /en', () => {
            expect(isTranslatedRoute('/en')).toBe(true);
        });

        it('returns false for /blog', () => {
            expect(isTranslatedRoute('/blog')).toBe(false);
        });

        it('returns false for /gems', () => {
            expect(isTranslatedRoute('/gems')).toBe(false);
        });

        it('returns false for /some-slug', () => {
            expect(isTranslatedRoute('/some-slug')).toBe(false);
        });
    });

    describe('constants', () => {
        it('has "de" as defaultLocale', () => {
            expect(defaultLocale).toBe('de');
        });

        it('supports de and en', () => {
            expect(supportedLocales).toEqual(['de', 'en']);
        });
    });
});
