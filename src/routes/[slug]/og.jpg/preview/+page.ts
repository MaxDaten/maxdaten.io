import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { client } from '$lib/sanity/client';
import { postBySlugQuery } from '$lib/sanity/queries';

export const prerender = 'auto';

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;

    try {
        // Get the blog post data from Sanity
        const post = await client.fetch(postBySlugQuery, { slug });

        if (!post) {
            throw error(404, 'Post not found');
        }

        // Use Sanity cover image URL if available
        const coverImageSrc = post.coverImage?.url ?? undefined;

        return {
            post: {
                title: post.title,
                slug: post.slug,
                date: post.date,
                excerpt: post.excerpt ?? '',
            },
            coverImageSrc,
        };
    } catch (err) {
        console.error(
            `Failed to load data for OG preview for slug: ${slug}`,
            err
        );
        error(500, 'Failed to load OG preview data');
    }
};
