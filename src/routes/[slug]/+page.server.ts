import type { PageServerLoad } from './$types';
import { client, previewClient } from '#lib/sanity/client.js';
import { postBySlugQuery, allPostSlugsQuery } from '#lib/sanity/queries.js';
import { error } from '@sveltejs/kit';
import { SANITY_PREVIEW_SECRET } from '$app/env/private';
import { building } from '$app/env';
import { highlightCodeBlocks } from '#lib/server/highlight.js';

export async function entries() {
    const posts = await client.fetch(allPostSlugsQuery);
    return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export const load: PageServerLoad = async ({ params, url }) => {
    const previewSecret = SANITY_PREVIEW_SECRET;
    const isPreview =
        !building &&
        previewSecret &&
        url.searchParams.get('preview') === previewSecret;
    const sanityClient = isPreview ? previewClient : client;

    const post = await sanityClient.fetch(postBySlugQuery, {
        slug: params.slug,
    });

    if (!post) {
        throw error(404, 'Post not found');
    }

    return {
        source: 'sanity' as const,
        post: { ...post, body: await highlightCodeBlocks(post.body) },
    };
};
