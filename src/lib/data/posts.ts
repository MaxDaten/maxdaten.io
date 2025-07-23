import type { BlogPost } from '$utils/types';
import { error } from '@sveltejs/kit';

export interface PostComponent {
    default: import('svelte').Component;
    metadata: BlogPost;
}

const slugRegex = /(?<slug>[^/]+)\.md$/;

export const postLoaders = import.meta.glob<PostComponent>(
    '/src/content/blog/*.md'
);

export const loaderBySlug = new Map<string, () => Promise<PostComponent>>(
    Object.entries(postLoaders).map(([path, loadPost]) => [
        path.match(slugRegex)?.groups?.slug ?? '',
        loadPost,
    ])
);

export const filterPosts = (posts: BlogPost[]) => {
    const byDate = (a: BlogPost, b: BlogPost) => {
        return new Date(a.date).getTime() > new Date(b.date).getTime()
            ? -1
            : new Date(a.date).getTime() < new Date(b.date).getTime()
              ? 1
              : 0;
    };
    return posts
        .filter((post) => !post.hidden)
        .sort(byDate)
        .map((post) => {
            const relatedPosts = getRelatedPosts(posts, post);
            return {
                ...post,
                relatedPosts: relatedPosts,
            } as BlogPost;
        });
};

export const readingTime = (text: string) => {
    const words = text.split(/\s+/);
    const minutes = Math.ceil(words.length / 200);
    return {
        minutes,
        text: `${minutes} min read`,
    };
};

const getRelatedPosts = (posts: BlogPost[], post: BlogPost) => {
    // Get the first 3 posts that have the highest number of tags in common
    const relatedPosts = posts
        .filter((p) => !p.hidden && p.slug !== post.slug)
        .sort((a, b) => {
            const aTags = a.tags?.filter((t) => post.tags?.includes(t));
            const bTags = b.tags?.filter((t) => post.tags?.includes(t));
            return aTags?.length > bTags?.length
                ? -1
                : aTags?.length < bTags?.length
                  ? 1
                  : 0;
        });

    return relatedPosts.slice(0, 3);
};

export async function importPostBySlug(slug: string) {
    const loadPost = loaderBySlug.get(slug) ?? error(404, 'Post not found');
    return await loadPost();
}
