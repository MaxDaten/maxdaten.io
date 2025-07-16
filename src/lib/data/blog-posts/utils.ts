import striptags from 'striptags';
import type { BlogPost } from '$lib/utils/types';
import { render } from 'svelte/server';

interface PostComponent {
    default: import('svelte').Component;
    metadata: BlogPost;
}

const loadedPosts = import.meta.glob<PostComponent>('/src/content/blog/*.md', {
    eager: true,
}) as Record<string, PostComponent>;

const postsBySlug = new Map<string, PostComponent>(
    Object.entries(loadedPosts).map(([_path, post]) => [
        post.metadata.slug,
        post,
    ])
);

export const importPosts = () => {
    const posts: BlogPost[] = [];
    for (const path in loadedPosts) {
        const post = loadedPosts[path];
        const renderedPost = render(post.default, { props: {} });
        if (post) {
            posts.push({
                ...post.metadata,
                readingTimeMinutes: readingTime(
                    striptags(striptags(renderedPost.body || ''))
                ).minutes,
            } as BlogPost);
        }
    }
    return posts;
};

export const getPostHtml = (post: BlogPost) => {
    const loadedPost = postsBySlug.get(post.slug);
    const renderedPost = render(loadedPost.default, { props: {} });
    return renderedPost.body;
};

export const filterPosts = (posts: BlogPost[]) => {
    return posts
        .filter((post) => !post.hidden)
        .sort((a, b) =>
            new Date(a.date).getTime() > new Date(b.date).getTime()
                ? -1
                : new Date(a.date).getTime() < new Date(b.date).getTime()
                  ? 1
                  : 0
        )
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

// #region Unexported Functions

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

// #endregion
