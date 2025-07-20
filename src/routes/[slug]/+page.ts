import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost } from '$utils/types';
import { getPostBySlug } from '$lib/data/blog-posts/utils';

export const load: PageLoad = async ({ params, data }) => {
    const post = getPostBySlug(params.slug) ?? error(404, 'Post not found');

    if (post.metadata.hidden) {
        error(404, 'Post not found');
    }

    return {
        ...data,
        content: post.default,
    } as BlogPost;
};
