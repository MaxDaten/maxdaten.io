import ProfileOgCard from '$routes/og.jpg/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authors } from '$lib/data/authors';
import { generateOgImage, processImageUrl } from '$lib/server/og-generation';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Get the author data (Jan-Philip Loos)
        const author = authors.jloos;
        const profileImageSrc = await loadProfileImage(url);

        return await generateOgImage(ProfileOgCard, {
            author,
            profileImageSrc,
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
