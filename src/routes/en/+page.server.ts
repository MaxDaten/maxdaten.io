import { getListingPosts } from '#lib/sanity/listing.js';

export async function load() {
    return { posts: await getListingPosts(4) };
}
