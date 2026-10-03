import { describe, it, expect } from 'vitest';
import {
    t,
    getLocaleFromPath,
    isTranslatedRoute,
    canonicalUrl,
    heroSummary,
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
                // Service names German buyers use in English.
                'services.platform.title',
                'services.delivery.title',
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

        it.each(['/impressum', '/datenschutz'])(
            'returns "de" for the German legal page %s',
            (path) => {
                expect(getLocaleFromPath(path)).toBe('de');
            }
        );

        it.each([
            '/blog',
            '/gems',
            '/2026-01-31-ship-your-toolchain-not-just-infrastructure',
            '/about/jloos',
            '/enterprise',
        ])('returns "en" for the English-only route %s', (path) => {
            expect(getLocaleFromPath(path)).toBe('en');
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

    describe('canonicalUrl()', () => {
        it.each([
            ['/', 'https://maxdaten.de/'],
            ['/impressum', 'https://maxdaten.de/impressum'],
            ['/en', 'https://www.maxdaten.io/en'],
            ['/blog', 'https://www.maxdaten.io/blog'],
            ['/some-slug', 'https://www.maxdaten.io/some-slug'],
        ])('maps %s to its final URL %s', (path, expected) => {
            expect(canonicalUrl(path)).toBe(expected);
        });
    });

    describe('heroSummary()', () => {
        it.each(['de', 'en'] as const)(
            'is the first subheadline paragraph as plain text (%s)',
            (locale) => {
                const summary = heroSummary(locale);
                expect(summary).not.toMatch(/[<>]/);
                expect(t(locale, 'hero.subheadline')).toMatch(
                    new RegExp(`^${RegExp.escape(summary)}<br><br>`)
                );
            }
        );
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
