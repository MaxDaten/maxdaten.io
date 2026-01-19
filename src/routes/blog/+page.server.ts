import type { PageServerLoad } from './$types';
import type { MetaTagsProps } from 'svelte-meta-tags';
import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';

/**
 * Listing post type - normalized shape for Sanity posts.
 * Used for card display on blog listing page.
 */
export type ListingPost = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags: string[];
    source: 'sanity';
    coverImage?: {
        url?: string;
        alt?: string;
        lqip?: string;
    };
};

export const load: PageServerLoad = async () => {
    const sanityPosts = await client.fetch(allPostsQuery);

    const posts: ListingPost[] = sanityPosts.map(
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

    const pageMetaTags = Object.freeze({
        title: 'Blog',
        description:
            'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        openGraph: {
            title: 'Blog',
            description:
                'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        },
        twitter: {
            title: 'Blog',
            description:
                'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        },
    }) satisfies MetaTagsProps;

    return {
        posts,
        pageMetaTags,
    };
};
