import { getPostBySlug } from '$lib/data/blog-posts/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = 'auto';

export const load: PageLoad = async ({ params, url }) => {
    const { slug } = params;

    try {
        // Get the blog post data
        const post =
            (await getPostBySlug(slug))?.metadata ??
            error(404, 'Post not found');
        const coverImageUrl = await _loadCoverImage(slug, url);

        return {
            post,
            coverImageSrc: coverImageUrl,
        };
    } catch (err) {
        console.error(
            `Failed to load data for OG preview for slug: ${slug}`,
            err
        );
        error(500, 'Failed to load OG preview data');
    }
};

async function _loadCoverImage(slug: string, url: URL) {
    const coverImageSrc = (
        await import(`$assets/images/posts/${slug}/cover.png?url`)
    ).default;
    return coverImageSrc.startsWith('http')
        ? coverImageSrc
        : new URL(coverImageSrc, url.origin).href;
}
