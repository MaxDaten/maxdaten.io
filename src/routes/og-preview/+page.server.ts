import { importPosts, filterPosts } from '$lib/data/blog-posts/utils';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
    try {
        // Get all blog posts
        const allPosts = await importPosts();
        const filteredPosts = filterPosts(allPosts);

        return {
            posts: filteredPosts,
        };
    } catch (err) {
        console.error('Failed to load blog posts for OG preview', err);
        return {
            posts: [],
        };
    }
};
