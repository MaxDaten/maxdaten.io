import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';
import type { ListingPost } from '../blog/+page.server';

export async function load() {
    const sanityPosts = await client.fetch(allPostsQuery);

    const posts: ListingPost[] = sanityPosts.slice(0, 4).map(
        (p: {
            slug: string;
            title: string;
            excerpt?: string;
            date: string;
            tags?: Array<{ name: string; slug: string }>;
            coverImage?: {
                url?: string;
                alt?: string;
                lqip?: string;
            };
        }) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            tags: p.tags?.map((t) => t.name) ?? [],
            source: 'sanity' as const,
            coverImage: p.coverImage,
        })
    );

    return {
        posts,
    };
}
