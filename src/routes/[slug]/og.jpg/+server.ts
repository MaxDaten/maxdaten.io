import OgCard from '$routes/[slug]/og.jpg/OgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '$lib/sanity/client';
import { postBySlugQuery } from '$lib/sanity/queries';
import { generateOgImage, processImageUrl } from '$lib/server/og-generation';

export const prerender = false;

export const GET: RequestHandler = async ({ params, url }) => {
    const { slug } = params;

    try {
        // Get the blog post data from Sanity
        const post = await client.fetch(postBySlugQuery, { slug });

        if (!post) {
            throw error(404, 'Post not found');
        }

        // Use Sanity cover image URL if available
        const coverImageSrc = post.coverImage?.url
            ? processImageUrl(post.coverImage.url, url)
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
