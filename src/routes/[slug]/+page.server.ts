import type { PageServerLoad } from './$types';
import { importPostBySlug } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    return (
        (await importPostBySlug(params.slug)) ?? error(404, 'Post not found')
    );
};
