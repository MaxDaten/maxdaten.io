import OgCard from '$routes/[slug]/og.jpg/OgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { importPostBySlug } from '$lib/server/posts';
import { generateOgImage, processImageUrl } from '$lib/server/og-generation';
import type { Picture } from 'imagetools-core';

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
    const { slug } = params;

    try {
        // Get the blog post data
        const post = await importPostBySlug(slug);
        const coverImageSrc = await loadCoverImage(slug, url);

        return await generateOgImage(OgCard, {
            post,
            coverImageSrc,
        });
    } catch (err) {
        console.error(`Failed to generate OG image for slug: ${slug}`, err);
        error(500, 'Failed to generate OG image');
    }
};

async function loadCoverImage(slug: string, url: URL) {
    const coverImageSrc: Picture = (
        await import(`$assets/images/posts/${slug}/cover.png?as=run?w=1200`)
    ).default;
    return processImageUrl(coverImageSrc.img.src, url);
}
