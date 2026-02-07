import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { authors } from '$lib/data/authors';
import { loadProfileImageUrl } from '../profile-image';
import { t, type Locale } from '$lib/i18n';

export const prerender = 'auto';

export const load: PageLoad = async ({ url }) => {
    try {
        const locale = (url.searchParams.get('locale') as Locale) || 'en';
        const author = authors.jloos;
        const avatarUrl = await loadProfileImageUrl(url);

        return {
            author,
            avatarUrl,
            locale,
            ogProps: {
                badge: t(locale, 'hero.badge'),
                headline: t(locale, 'hero.headline'),
                headlineAccent: t(locale, 'hero.headlineAccent'),
                sub: t(locale, 'hero.subheadline'),
                brand: locale === 'de' ? 'maxdaten.de' : 'maxdaten.io',
            },
        };
    } catch (err) {
        console.error('Failed to load data for profile OG preview', err);
        error(500, 'Failed to load profile OG preview data');
    }
};
