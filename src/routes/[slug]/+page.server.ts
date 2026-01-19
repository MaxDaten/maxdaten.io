import type { PageServerLoad } from './$types';
import type { PostData } from '$utils/types';
import { client, previewClient } from '$lib/sanity/client';
import { postBySlugQuery } from '$lib/sanity/queries';
import { importPostBySlug } from '$lib/server/posts';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({
    params,
    url,
}): Promise<PostData> => {
    // Check for preview mode
    const previewSecret = env.SANITY_PREVIEW_SECRET;
    const isPreview =
        previewSecret && url.searchParams.get('preview') === previewSecret;
    const sanityClient = isPreview ? previewClient : client;

    // Try Sanity first
    try {
        const sanityPost = await sanityClient.fetch(postBySlugQuery, {
            slug: params.slug,
        });

        if (sanityPost) {
            return {
                source: 'sanity' as const,
                post: sanityPost,
            };
        }
    } catch (e) {
        // Per CONTEXT.md: API failure shows error, don't silently fall back
        console.error('Sanity fetch failed:', e);
        throw error(503, 'Content service unavailable');
    }

    // Fall back to markdown
    try {
        const mdPost = await importPostBySlug(params.slug);
        return {
            source: 'markdown' as const,
            post: mdPost,
        };
    } catch {
        throw error(404, 'Post not found');
    }
};
