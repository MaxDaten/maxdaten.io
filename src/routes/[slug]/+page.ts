import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost, PostData, SanityPost } from '$utils/types';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { loaderBySlug } from '$lib/data/posts';
import { createBlogPostingSchema } from '$lib/data/meta';
import { getAuthor } from '$lib/data/authors';
import type { BlogPosting, WithContext } from 'schema-dts';

type PageData = PostData & {
    content?: BlogPost['content'];
    pageMetaTags: MetaTagsProps;
    pageSchema: WithContext<BlogPosting>[];
};

export const load: PageLoad = async ({
    params,
    data,
    url,
}): Promise<PageData> => {
    const serverData = data as PostData;
    const ogImageUrl = new URL(`${url.pathname}/og.jpg`, url.origin).href;

    if (serverData.source === 'sanity') {
        // Sanity post - metadata comes from the post object
        const post = serverData.post as SanityPost;

        // Build schema with Sanity post data
        // Note: createBlogPostingSchema expects BlogPost shape
        const pageSchema = post.author
            ? [
                  createBlogPostingSchema(
                      {
                          title: post.title,
                          slug: post.slug,
                          date: post.date,
                          updated: post.lastModified ?? post.date,
                          excerpt: post.excerpt ?? '',
                          tags: post.tags?.map((t) => t.name) ?? [],
                          keywords: post.keywords ?? [],
                          hidden: post.hidden ?? false,
                          readingTimeMinutes: undefined,
                          relatedPosts: [],
                          content: undefined as unknown as BlogPost['content'],
                          authorId: 'jloos', // TODO: map from Sanity author
                      },
                      url.href
                  ),
              ]
            : [];

        const pageMetaTags = Object.freeze({
            title: post.title,
            description: post.excerpt ?? '',
            canonical: new URL(url.pathname, url.origin).href,
            openGraph: {
                title: post.title,
                description: post.excerpt ?? '',
                url: new URL(url.pathname, url.origin).href,
                type: 'article',
                images: post.coverImage?.url
                    ? [
                          {
                              url: post.coverImage.url,
                              width: post.coverImage.dimensions?.width ?? 1200,
                              height: post.coverImage.dimensions?.height ?? 630,
                              secureUrl: post.coverImage.url,
                              alt: post.coverImage.alt ?? post.title,
                              type: 'image/jpeg',
                          },
                      ]
                    : [
                          {
                              url: ogImageUrl,
                              width: 1200,
                              height: 630,
                              secureUrl: ogImageUrl,
                              alt: post.title,
                              type: 'image/jpeg',
                          },
                      ],
            },
            twitter: {
                title: post.title,
                description: post.excerpt ?? '',
                cardType: 'summary_large_image',
                image: post.coverImage?.url ?? ogImageUrl,
                imageAlt: post.coverImage?.alt ?? post.title,
            } as Twitter,
        }) satisfies MetaTagsProps;

        return {
            ...serverData,
            pageMetaTags,
            pageSchema,
        };
    }

    // Markdown post - load component and extract metadata
    const loadPost =
        loaderBySlug.get(params.slug) ?? error(404, 'Post not found');
    const post = await loadPost();

    // Generate blog posting schema
    const author = post.metadata.authorId
        ? getAuthor(post.metadata.authorId)
        : undefined;
    const pageSchema = author
        ? [createBlogPostingSchema(post.metadata, url.href)]
        : [];

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
                    type: 'image/jpeg',
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
        ...serverData,
        content: post.default,
        pageMetaTags,
        pageSchema,
    };
};
