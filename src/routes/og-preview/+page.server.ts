import type { PageServerLoad } from './$types';
import { getListingPosts } from '#lib/sanity/listing.js';

export const prerender = true;

export const load: PageServerLoad = async () => {
    const posts = await getListingPosts();
    return { posts };
};
