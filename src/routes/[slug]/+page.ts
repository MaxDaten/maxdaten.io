import type { PageLoad } from './$types';
import type { PostData, SanityPost } from '#lib/utils/types.js';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { createBlogPostingSchema } from '#lib/data/meta.js';
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';
import { version } from '$app/env';
import { canonicalUrl } from '#lib/i18n/index.js';
import { createBreadcrumbSchema } from '#lib/data/meta.js';
import { urlFor } from '#lib/sanity/image.js';
import { postModifiedAt } from '#lib/sanity/post-dates.js';

type PageData = PostData & {
    pageMetaTags: MetaTagsProps;
    pageSchema: (WithContext<BlogPosting> | WithContext<BreadcrumbList>)[];
};

export const load: PageLoad = async ({ data, url }): Promise<PageData> => {
    const serverData = data as PostData;
    const post = serverData.post as SanityPost;
    // Editors can override title, description and social image in the studio's SEO group.
    const seo = post.seo ?? {};
    const metaTitle = seo.metaTitle || post.title;
    const metaDescription = seo.metaDescription || post.excerpt || '';
    const ogImageUrl = seo.ogImage
        ? urlFor(seo.ogImage).width(1200).height(630).format('jpg').url()
        : new URL(`${url.pathname}/og.jpg?v=${version}`, url.origin).href;
    // Hidden posts are unlisted, not private: reachable by link, but kept out of search.
    const noIndex = (post.hidden ?? false) || (seo.noIndex ?? false);

    // Build schema with Sanity post data
    const pageSchema = post.author
        ? [
              createBlogPostingSchema(
                  {
                      title: post.title,
                      slug: post.slug,
                      date: post.date,
                      updated: postModifiedAt(post),
                      excerpt: metaDescription,
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
        title: metaTitle,
        description: metaDescription,
        canonical: canonicalUrl(url.pathname),
        ...(noIndex && { robots: 'noindex,follow' }),
        openGraph: {
            title: metaTitle,
            description: metaDescription,
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
            title: metaTitle,
            description: metaDescription,
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
