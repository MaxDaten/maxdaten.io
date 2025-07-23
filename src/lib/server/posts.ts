import type { BlogPost } from '$utils/types';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import striptags from 'striptags';
import {
    filterPosts,
    loaderBySlug,
    type PostComponent,
    postLoaders,
    readingTime,
} from '$lib/data/posts';

type PostLoader = () => Promise<PostComponent>;

export const allPosts = await importPosts();
export const filteredPosts = filterPosts(allPosts);
export const allPostsBySlug = allPosts.reduce(
    (acc, post) => acc.set(post.slug, post),
    new Map<string, BlogPost>()
);

export async function importPosts(): Promise<BlogPost[]> {
    return Promise.all(
        Object.entries(postLoaders).map(
            async ([_path, loadPost]) => await toBlogPost(loadPost)
        )
    );
}

export async function importPostBySlug(slug: string): Promise<BlogPost> {
    const loadPost = loaderBySlug.get(slug) ?? error(404, 'Post not found');
    return await toBlogPost(loadPost);
}

async function toBlogPost(postComponent: PostLoader): Promise<BlogPost> {
    const post = await postComponent();
    const renderedPost = render(post.default, { props: {} });
    return {
        ...post.metadata,
        readingTimeMinutes: readingTime(
            striptags(striptags(renderedPost.body || ''))
        ).minutes,
    };
}

export const getPostHtml = async (post: BlogPost) => {
    const loadPost =
        loaderBySlug.get(post.slug) ?? error(404, 'Post not found');
    const loadedPost = await loadPost();
    const renderedPost = render(loadedPost.default, { props: {} });
    return renderedPost.body;
};
