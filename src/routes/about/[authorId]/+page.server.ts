import { error } from '@sveltejs/kit';
import { getAuthor } from '#lib/data/authors.js';
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
        // Merged over the layout's tags; the card is a playful extra, not an indexed page.
        pageMetaTags: {
            title: `${author.name} - Trading Card`,
            description: `Trading card for ${author.name} - ${author.tagline}`,
            robots: 'noindex,nofollow',
        },
    };
};
