import { error } from '@sveltejs/kit';
import { getAuthor, getAuthorSlugs, SITE_AUTHOR } from '#lib/sanity/author.js';
import { createProfilePageSchema } from '#lib/data/meta.js';
import type { PageServerLoad } from './$types';

export const prerender = true;

export async function entries() {
    return (await getAuthorSlugs()).map((authorId) => ({ authorId }));
}

export const load: PageServerLoad = async ({ params }) => {
    const { authorId } = params;

    const author = await getAuthor(authorId);

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
        // The site author is the Person the base JSON-LD describes.
        pageSchema: authorId === SITE_AUTHOR ? [createProfilePageSchema()] : [],
    };
};
