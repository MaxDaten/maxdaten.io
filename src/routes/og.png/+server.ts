import ProfileOgCard from '$routes/og.png/ProfileOgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authors } from '$lib/data/authors';
import {
    generateOgImage,
    createOgImageResponse,
    processImageUrl,
} from '$lib/server/og-generation';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Get the author data (Jan-Philip Loos)
        const author = authors.jloos;
        const profileImageSrc = await loadProfileImage(url);

        const pngBuffer = await generateOgImage(ProfileOgCard, {
            author,
            profileImageSrc,
            title: 'Jan-Philip Loos',
            tagline: 'functional & automated',
            role: 'DevOps, Fullstack, Cloud Engineer',
            bio: 'Software engineer and DevOps consultant from Hamburg, Germany. Helping businesses build robust, scalable infrastructure.',
            specialties: [
                'Kubernetes',
                'Google Cloud Platform',
                'Infrastructure as Code',
                'CI/CD Automation',
            ],
        });

        return createOgImageResponse(pngBuffer);
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
