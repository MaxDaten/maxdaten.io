import { error } from '@sveltejs/kit';
import { authors, getAuthor } from '#lib/data/authors.js';
import type { PageServerLoad } from './$types';

export const prerender = true;

export function entries() {
    return Object.keys(authors).map((authorId) => ({ authorId }));
}

export const load: PageServerLoad = async ({ params }) => {
    const { authorId } = params;

    const author = getAuthor(authorId);

    if (!author) {
        throw error(404, `Author with ID "${authorId}" not found`);
    }

    return {
        author,
        // Merged over the layout's tags: this is the author page that post bylines link to.
        pageMetaTags: {
            title: `About ${author.name}`,
            description: author.bio,
        },
    };
};
