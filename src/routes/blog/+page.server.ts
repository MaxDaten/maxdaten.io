import type { PageServerLoad } from './$types';
import type { MetaTagsProps } from 'svelte-meta-tags';
import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';
import { filteredPosts as markdownPosts } from '$lib/server/posts';

/**
 * Listing post type - normalized shape for both sources.
 * This is a subset of BlogPost that works for card display.
 */
export type ListingPost = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags: string[];
    readingTimeMinutes?: number;
    source: 'sanity' | 'markdown';
    // Sanity-specific fields for cover image
    coverImage?: {
        url?: string;
        alt?: string;
        lqip?: string;
    };
};

export const load: PageServerLoad = async () => {
    // Fetch from Sanity
    let sanityPosts: Array<{
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
    }> = [];

    try {
        sanityPosts = await client.fetch(allPostsQuery);
    } catch (e) {
        console.error('Sanity fetch failed:', e);
        // Continue with markdown-only if Sanity fails
    }

    // Normalize Sanity posts to listing shape
    const normalizedSanityPosts: ListingPost[] = sanityPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        tags: p.tags?.map((t) => t.name) ?? [],
        readingTimeMinutes: undefined, // Could calculate from body if needed
        source: 'sanity' as const,
        coverImage: p.coverImage,
    }));

    // Deduplicate: Sanity wins for matching slugs
    const sanitySlugSet = new Set(normalizedSanityPosts.map((p) => p.slug));
    const normalizedMarkdownPosts: ListingPost[] = markdownPosts
        .filter((p) => !sanitySlugSet.has(p.slug))
        .map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            tags: p.tags ?? [],
            readingTimeMinutes: p.readingTimeMinutes,
            source: 'markdown' as const,
        }));

    // Merge and sort by date descending
    const allPosts = [
        ...normalizedSanityPosts,
        ...normalizedMarkdownPosts,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        posts: allPosts,
        pageMetaTags,
    };
};
