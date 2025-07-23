import { filteredPosts } from '$lib/server/posts';

export async function load() {
    const posts = filteredPosts.slice(0, 4);

    return {
        posts,
    };
}
