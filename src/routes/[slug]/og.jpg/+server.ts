import OgCard from '#routes/[slug]/og.jpg/OgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '#lib/sanity/client.js';
import { allPostSlugsQuery, postBySlugQuery } from '#lib/sanity/queries.js';
import { generateOgImage } from '#lib/server/og-generation.js';

// Rendered at build time: satori takes ~3 s per card, too slow for a cold request.
export const prerender = true;

export async function entries() {
    const posts = await client.fetch(allPostSlugsQuery);
    return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

/**
 * Process Sanity image URL for OG card - resize to reduce SVG size.
 * Satori embeds images as base64, so large images cause buffer overflow.
 */
function processCoverImageUrl(sanityUrl: string): string {
    // Sanity CDN URLs support transformation parameters
    // Resize to max 800px width for OG card (actual display is ~480px at 40% height)
    // Use format=jpg and quality=80 to further reduce size
    const url = new URL(sanityUrl);
    url.searchParams.set('w', '800');
    url.searchParams.set('q', '80');
    url.searchParams.set('fm', 'jpg');
    return url.toString();
}

export const GET: RequestHandler = async ({ params }) => {
    const { slug } = params;

    // Outside the try: the catch below would turn this 404 into a 500.
    const post = await client.fetch(postBySlugQuery, { slug });
    if (!post) {
        error(404, 'Post not found');
    }

    try {
        // Use Sanity cover image URL if available, resize to prevent SVG buffer overflow
        const coverImageSrc = post.coverImage?.url
            ? processCoverImageUrl(post.coverImage.url)
            : undefined;

        return await generateOgImage(OgCard, {
            post: {
                title: post.title,
                slug: post.slug,
                date: post.date,
                excerpt: post.excerpt ?? '',
                tags: post.tags?.map((t: { name: string }) => t.name) ?? [],
            },
            coverImageSrc,
        });
    } catch (err) {
        console.error(`Failed to generate OG image for slug: ${slug}`, err);
        error(500, 'Failed to generate OG image');
    }
};
