import type { PageLoad } from './$types';
import type { PostData, SanityPost } from '$utils/types';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { createBlogPostingSchema } from '$lib/data/meta';
import type { BlogPosting, WithContext } from 'schema-dts';

type PageData = PostData & {
    pageMetaTags: MetaTagsProps;
    pageSchema: WithContext<BlogPosting>[];
};

export const load: PageLoad = async ({ data, url }): Promise<PageData> => {
    const serverData = data as PostData;
    const post = serverData.post as SanityPost;
    const ogImageUrl = new URL(`${url.pathname}/og.jpg`, url.origin).href;

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
};
