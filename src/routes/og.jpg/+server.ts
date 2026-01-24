import ProfileOgCard from '$routes/og.jpg/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateOgImage } from '$lib/server/og-generation';
import { loadProfileImageUrl } from './profile-image';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
    try {
        const avatarUrl = await loadProfileImageUrl(url);

        return await generateOgImage(ProfileOgCard, {
            badge: 'Available for 2026',
            avatarUrl,
        });
    } catch (err) {
        console.error('Failed to generate profile OG image', err);
        error(500, 'Failed to generate profile OG image');
    }
};
