import { error } from '@sveltejs/kit';
import { getAuthor } from '$lib/data/authors';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
    const { authorId } = params;

    const author = getAuthor(authorId);

    if (!author) {
        throw error(404, `Author with ID "${authorId}" not found`);
    }

    return {
        author,
    };
};
