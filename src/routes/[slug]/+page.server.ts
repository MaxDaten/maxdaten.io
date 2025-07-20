import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BlogPost, Author } from '$utils/types';
import { getPostBySlug, readingTime } from '$lib/data/blog-posts/utils';
import { getAuthor } from '$lib/data/authors';
import { render } from 'svelte/server';
import striptags from 'striptags';

export const load: PageServerLoad = async ({ params }) => {
    const post = getPostBySlug(params.slug) ?? error(404, 'Post not found!');

    if (post.metadata.hidden) {
        error(404, 'Post not found');
    }

    const readingTimeMinutes = readingTime(
        striptags(render(post.default, { props: {} }).body)
    ).minutes;

    let author: Author | undefined = undefined;
    if (post.metadata.authorId) {
        author = getAuthor(post.metadata.authorId);
    }

    return {
        ...post.metadata,
        readingTimeMinutes,
        author,
    } as BlogPost & { author?: Author };
};
