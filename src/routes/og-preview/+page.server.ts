import type { PageServerLoad } from './$types';
import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';

export const prerender = true;

export const load: PageServerLoad = async () => {
    const sanityPosts = await client.fetch(allPostsQuery);

    const posts = sanityPosts.map(
        (p: {
            slug: string;
            title: string;
            excerpt?: string;
            date: string;
            coverImage?: { url?: string };
        }) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            coverImage: p.coverImage,
        })
    );

    return { posts };
};
