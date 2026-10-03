import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { loadProfileImageUrl } from '../profile-image';
import { t, type Locale, heroSummary } from '#lib/i18n/index.js';

// Reads ?locale= at request time, so it cannot be prerendered.
export const prerender = false;

export const load: PageLoad = async ({ url, parent }) => {
    try {
        const locale = (url.searchParams.get('locale') as Locale) || 'en';
        const { siteAuthor: author } = await parent();
        const avatarUrl = await loadProfileImageUrl(url);

        return {
            author,
            avatarUrl,
            locale,
            ogProps: {
                badge: t(locale, 'hero.badge'),
                headline: t(locale, 'hero.headline'),
                headlineAccent: t(locale, 'hero.headlineAccent'),
                sub: heroSummary(locale),
                brand: locale === 'de' ? 'maxdaten.de' : 'maxdaten.io',
            },
        };
    } catch (err) {
        console.error('Failed to load data for profile OG preview', err);
        error(500, 'Failed to load profile OG preview data');
    }
};
