import ProfileOgCard from '#routes/og.jpg/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOgImage } from '#lib/server/og-generation.js';
import { ogPortraitDataUri } from '#lib/server/og-portrait.js';
import { t, supportedLocales, type Locale } from '#lib/i18n/index.js';

// Rendered at build time, one card per locale: satori is too slow for a cold request.
export const prerender = true;

export function entries() {
    return supportedLocales.map((locale) => ({ locale }));
}

export const GET: RequestHandler = async ({ params }) => {
    const locale = params.locale as Locale;
    if (!supportedLocales.includes(locale)) {
        error(404, 'Unknown locale');
    }

    return await generateOgImage(ProfileOgCard, {
        badge: t(locale, 'hero.badge'),
        headline: t(locale, 'hero.headline'),
        headlineAccent: t(locale, 'hero.headlineAccent'),
        sub: t(locale, 'hero.subheadline'),
        brand: locale === 'de' ? 'maxdaten.de' : 'maxdaten.io',
        avatarUrl: ogPortraitDataUri,
    });
};
