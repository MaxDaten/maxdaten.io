import OgCard from '$routes/[slug]/og.png/OgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { importPostBySlug } from '$lib/server/posts';
import {
    generateOgImage,
    createOgImageResponse,
    processImageUrl,
} from '$lib/server/og-generation';

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
    const { slug } = params;

    try {
        // Get the blog post data
        const post = await importPostBySlug(slug);
        const coverImageSrc = await loadCoverImage(slug, url);

        const pngBuffer = await generateOgImage(OgCard, {
            post,
            coverImageSrc,
        });

        return createOgImageResponse(pngBuffer);
    } catch (err) {
        console.error(`Failed to generate OG image for slug: ${slug}`, err);
        error(500, 'Failed to generate OG image');
    }
};

async function loadCoverImage(slug: string, url: URL) {
    const coverImageSrc = (
        await import(`$assets/images/posts/${slug}/cover.png?url`)
    ).default;
    return processImageUrl(coverImageSrc, url);
}
