import type { PageServerLoad } from './$types';
import { filteredPosts } from '$lib/server/posts';

export const prerender = true;

export const load: PageServerLoad = async () => {
    return { posts: filteredPosts };
};
