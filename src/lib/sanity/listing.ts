import { client } from '#lib/sanity/client.js';
import { allPostsQuery } from '#lib/sanity/queries.js';

/** A post as shown on listing cards (blog index, home page, OG preview). */
export type ListingPost = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags: string[];
    coverImage?: {
        url?: string;
        alt?: string;
        lqip?: string;
    };
};

type SanityListingPost = Omit<ListingPost, 'tags'> & {
    tags?: Array<{ name: string; slug: string }>;
};

export function toListingPost(post: SanityListingPost): ListingPost {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        tags: post.tags?.map((t) => t.name) ?? [],
        coverImage: post.coverImage,
    };
}

/** Published, non-hidden posts, newest first; `limit` keeps the first n. */
export async function getListingPosts(limit?: number): Promise<ListingPost[]> {
    const posts: SanityListingPost[] = await client.fetch(allPostsQuery);
    return posts.slice(0, limit).map(toListingPost);
}
