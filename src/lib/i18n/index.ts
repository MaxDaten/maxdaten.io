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

/** First paragraph of the hero subheadline as plain text, for places that can't render HTML. */
export function heroSummary(locale: Locale): string {
    return t(locale, 'hero.subheadline').split('<br><br>')[0];
}

/** German pages: the German home and the legal pages. Everything else is English. */
const germanRoutes = new Set(['/', '/impressum', '/datenschutz']);

/** Derive locale from a URL pathname. */
export function getLocaleFromPath(pathname: string): Locale {
    return germanRoutes.has(pathname) ? 'de' : 'en';
}

/** Routes that have both a German and English version. */
const translatedRoutes = new Set(['/', '/en', '/en/']);

/** Returns true for routes that exist in both languages. */
export function isTranslatedRoute(pathname: string): boolean {
    return translatedRoutes.has(pathname);
}

/**
 * Canonical origin per locale. The English origin is www because Vercel redirects the
 * maxdaten.io apex there; pointing at the apex would add a redirect hop.
 */
export const localeDomains: Record<Locale, string> = {
    de: 'https://maxdaten.de',
    en: 'https://www.maxdaten.io',
};

/** Returns the canonical base URL for a locale. */
export function getSiteBaseUrl(locale: Locale): string {
    return localeDomains[locale];
}

/** The final (non-redirecting) URL of a page, on its locale's origin. */
export function canonicalUrl(pathname: string): string {
    return new URL(pathname, getSiteBaseUrl(getLocaleFromPath(pathname))).href;
}

/** Hosts the site is served from in production, including the redirecting ones. */
const productionHosts = new Set([
    'maxdaten.de',
    'www.maxdaten.de',
    'maxdaten.io',
    'www.maxdaten.io',
]);

function isProductionOrigin(origin: string): boolean {
    return productionHosts.has(new URL(origin).hostname);
}

/** An absolute link to another site; siteHref() links to this site's own hosts are internal. */
export function isExternalHref(href: string): boolean {
    return /^https?:\/\//.test(href) && !isProductionOrigin(href);
}

/**
 * Link to a page of this site. On the production domains it is the page's final URL, so a link
 * from a German page to an English one (or the reverse) crosses domains instead of bouncing
 * through a redirect; anywhere else (localhost, preview deployments) it stays on the current host.
 */
export function siteHref(pathname: string, currentOrigin: string): string {
    return isProductionOrigin(currentOrigin)
        ? canonicalUrl(pathname)
        : pathname;
}

const homePaths: Record<Locale, string> = { de: '/', en: '/en' };

/** Link to a locale's home page; see siteHref(). */
export function homeHref(locale: Locale, currentOrigin: string): string {
    return siteHref(homePaths[locale], currentOrigin);
}
