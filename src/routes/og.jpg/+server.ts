import ProfileOgCard from '$routes/og.jpg/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOgImage, processImageUrl } from '$lib/server/og-generation';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
    try {
        const avatarUrl = await loadProfileImage(url);

        return await generateOgImage(ProfileOgCard, {
            badge: 'Available for 2026',
            avatarUrl,
        });
    } catch (err) {
        console.error('Failed to generate profile OG image', err);
        error(500, 'Failed to generate profile OG image');
    }
};

async function loadProfileImage(url: URL) {
    try {
        const profileImageSrc = (
            await import(`$assets/images/authors/jloos.png?url`)
        ).default;
        return processImageUrl(profileImageSrc, url);
    } catch (_err) {
        console.warn('Profile image not found, proceeding without image');
        return undefined;
    }
}
