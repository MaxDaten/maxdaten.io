import type { PageServerLoad } from './$types';
import { client, previewClient } from '$lib/sanity/client';
import { postBySlugQuery, allPostSlugsQuery } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export async function entries() {
    const posts = await client.fetch(allPostSlugsQuery);
    return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export const load: PageServerLoad = async ({ params, url }) => {
    const previewSecret = env.SANITY_PREVIEW_SECRET;
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
        post,
    };
};
