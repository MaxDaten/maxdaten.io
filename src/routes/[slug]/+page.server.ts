import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { importPostBySlug } from '$lib/server/posts';

export const load: PageServerLoad = async ({ params }) => {
    const post = await importPostBySlug(params.slug);

    if (post.hidden) {
        error(404, 'Post not found');
    }

    return post;
};
