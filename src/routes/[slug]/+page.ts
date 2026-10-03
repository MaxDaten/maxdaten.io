import type { PageLoad } from './$types';
import type { PostData, SanityPost } from '#lib/utils/types.js';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { createBlogPostingSchema } from '#lib/data/meta.js';
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';
import { version } from '$app/env';
import { canonicalUrl } from '#lib/i18n/index.js';
import { createBreadcrumbSchema } from '#lib/data/meta.js';

type PageData = PostData & {
    pageMetaTags: MetaTagsProps;
    pageSchema: (WithContext<BlogPosting> | WithContext<BreadcrumbList>)[];
};

export const load: PageLoad = async ({ data, url }): Promise<PageData> => {
    const serverData = data as PostData;
    const post = serverData.post as SanityPost;
    const ogImageUrl = new URL(
        `${url.pathname}/og.jpg?v=${version}`,
        url.origin
    ).href;

    // Build schema with Sanity post data
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
                      content: undefined as unknown as never,
                      authorId: 'jloos', // TODO: map from Sanity author
                  },
                  canonicalUrl(url.pathname),
                  post.coverImage?.url ?? ogImageUrl
              ),
              createBreadcrumbSchema([
                  ['Home', canonicalUrl('/en')],
                  ['Blog', canonicalUrl('/blog')],
                  [post.title, canonicalUrl(url.pathname)],
              ]),
          ]
        : [];

    const pageMetaTags = Object.freeze({
        title: post.title,
        description: post.excerpt ?? '',
        canonical: canonicalUrl(url.pathname),
        openGraph: {
            title: post.title,
            description: post.excerpt ?? '',
            url: canonicalUrl(url.pathname),
            type: 'article',
            images: [
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
            image: ogImageUrl,
            imageAlt: post.title,
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        ...serverData,
        pageMetaTags,
        pageSchema,
    };
};
