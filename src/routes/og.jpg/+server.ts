import ProfileOgCard from '$routes/og.jpg/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOgImage } from '$lib/server/og-generation';
import { loadProfileImageUrl } from './profile-image';
import { t, type Locale } from '$lib/i18n';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
    try {
        const locale = (url.searchParams.get('locale') as Locale) || 'en';
        const avatarUrl = await loadProfileImageUrl(url);

        return await generateOgImage(ProfileOgCard, {
            badge: t(locale, 'hero.badge'),
            headline: t(locale, 'hero.headline'),
            headlineAccent: t(locale, 'hero.headlineAccent'),
            sub: t(locale, 'hero.subheadline'),
            brand: locale === 'de' ? 'maxdaten.de' : 'maxdaten.io',
            avatarUrl,
        });
    } catch (err) {
        console.error('Failed to generate profile OG image', err);
        error(500, 'Failed to generate profile OG image');
    }
};
