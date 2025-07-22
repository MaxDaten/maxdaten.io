import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost } from '$utils/types';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { getPostBySlug } from '$lib/data/blog-posts/utils';

export const load: PageLoad = async ({ params, data, url }) => {
    const post = getPostBySlug(params.slug) ?? error(404, 'Post not found');

    if (post.metadata.hidden) {
        error(404, 'Post not found');
    }

    const ogImageUrl = new URL(`${url.pathname}/og.png`, url.origin).href;

    const pageMetaTags = Object.freeze({
        title: post.metadata.title,
        description: post.metadata.excerpt,
        canonical: new URL(url.pathname, url.origin).href,
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.excerpt,
            url: new URL(url.pathname, url.origin).href,
            type: 'article',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    secureUrl: ogImageUrl,
                    alt: post.metadata.title,
                    type: 'image/png',
                },
            ],
        },
        twitter: {
            title: post.metadata.title,
            description: post.metadata.excerpt,
            cardType: 'summary_large_image',
            image: ogImageUrl,
            imageAlt: post.metadata.title,
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        ...data,
        content: post.default,
        pageMetaTags,
    } as BlogPost & { pageMetaTags: MetaTagsProps };
};
