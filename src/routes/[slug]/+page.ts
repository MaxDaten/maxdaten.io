import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost } from '$utils/types';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { getPostBySlug } from '$lib/data/blog-posts/utils';
import { getCoverBySlug } from '$utils/image-loader';

export const load: PageLoad = async ({ params, data, url }) => {
    const post = getPostBySlug(params.slug) ?? error(404, 'Post not found');

    if (post.metadata.hidden) {
        error(404, 'Post not found');
    }

    const coverImage = getCoverBySlug(post.metadata.slug);

    const pageMetaTags = Object.freeze({
        title: post.metadata.title,
        description: post.metadata.excerpt,
        canonical: new URL(url.pathname, url.origin).href,
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.excerpt,
            url: new URL(url.pathname, url.origin).href,
            type: 'article',
            ...(coverImage && {
                images: [
                    {
                        url: coverImage.img.src,
                        alt: post.metadata.title,
                        width: coverImage.img.w,
                        height: coverImage.img.h,
                        secureUrl: coverImage.img.src,
                        type: 'image/jpg',
                    },
                ],
            }),
        },
        twitter: {
            title: post.metadata.title,
            description: post.metadata.excerpt,
            cardType: 'summary_large_image',
            ...(coverImage && {
                image: coverImage.img.src,
                imageAlt: post.metadata.title,
            }),
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        ...data,
        content: post.default,
        pageMetaTags,
    } as BlogPost & { pageMetaTags: MetaTagsProps };
};
