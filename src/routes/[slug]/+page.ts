import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost } from '$utils/types';

export const load: PageLoad = async ({ params }) => {
    const post = await import(`../../content/blog/${params.slug}.md`);

    if (!post || post.metadata.hidden) {
        throw error(404, 'Post not found');
    }

    return {
        ...post.metadata,
        content: post.default,
    } as BlogPost;
};
