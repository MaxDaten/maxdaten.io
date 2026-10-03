import { error } from '@sveltejs/kit';
import { getAuthor, SITE_AUTHOR } from '#lib/sanity/author.js';

// Server-only, so the browser never calls Sanity: the prerendered __data.json carries the result.
export const load = async () => {
    const siteAuthor = await getAuthor(SITE_AUTHOR);
    if (!siteAuthor) error(500, `Sanity author "${SITE_AUTHOR}" not found`);
    return { siteAuthor };
};
