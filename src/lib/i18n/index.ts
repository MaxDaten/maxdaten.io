import type { Locale, TranslationKeys } from './types';
import { en } from './en';
import { de } from './de';

export type { Locale, TranslationKeys };

export const defaultLocale: Locale = 'de';
export const supportedLocales: Locale[] = ['de', 'en'];

const translations: Record<Locale, TranslationKeys> = { de, en };

/** Look up a translation key for the given locale, falling back to defaultLocale. */
export function t(locale: Locale, key: keyof TranslationKeys): string {
    return translations[locale]?.[key] ?? translations[defaultLocale][key];
}

/** Derive locale from a URL pathname. `/en/*` → 'en', everything else → 'de'. */
export function getLocaleFromPath(pathname: string): Locale {
    if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
    return 'de';
}

/** Routes that have both a German and English version. */
const translatedRoutes = new Set(['/', '/en', '/en/']);

/** Returns true for routes that exist in both languages. */
export function isTranslatedRoute(pathname: string): boolean {
    return translatedRoutes.has(pathname);
}

/** Canonical domain per locale (used for hreflang / language switcher). */
export const localeDomains: Record<Locale, string> = {
    de: 'https://maxdaten.de',
    en: 'https://maxdaten.io',
};

/** Returns the canonical base URL for a locale. */
export function getSiteBaseUrl(locale: Locale): string {
    return localeDomains[locale];
}
