import type { PageServerLoad } from './$types';
import { client, previewClient } from '$lib/sanity/client';
import { postBySlugQuery } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

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
