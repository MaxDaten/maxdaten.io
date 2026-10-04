import type { PageLoad } from './$types';
import type { PostData, SanityPost } from '#lib/utils/types.js';
import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { createBlogPostingSchema } from '#lib/data/meta.js';
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';
import { version } from '$app/env';
import { canonicalUrl, localeDomains } from '#lib/i18n/index.js';
import { createBreadcrumbSchema } from '#lib/data/meta.js';
import { urlFor } from '#lib/sanity/image.js';
import { postModifiedAt } from '#lib/sanity/post-dates.js';
import { SITE_AUTHOR } from '#lib/sanity/site-author.js';
import { calculateReadingTime, countWords } from '#lib/sanity/reading-time.js';

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
        : `${localeDomains.en}${url.pathname}/og.jpg?v=${version}`;
    // Hidden posts are unlisted, not private: reachable by link, but kept out of search.
    const noIndex = (post.hidden ?? false) || (seo.noIndex ?? false);

    const pageUrl = canonicalUrl(url.pathname);
    const authorId = post.author?.id ?? SITE_AUTHOR;
    const publishedTime = post.date;
    const modifiedTime = postModifiedAt(post);
    const tags = post.tags?.map((t) => t.name) ?? [];

    // Build schema with Sanity post data
    const pageSchema = post.author
        ? [
              createBlogPostingSchema(
                  {
                      title: post.title,
                      date: publishedTime,
                      updated: modifiedTime,
                      excerpt: metaDescription,
                      tags,
                      // A social-card-sized image, not the full-resolution upload.
                      image:
                          post.coverImage?.url && !seo.ogImage
                              ? urlFor(post.coverImage).width(1200).url()
                              : ogImageUrl,
                      wordCount: countWords(post.body),
                      readingTimeMinutes: calculateReadingTime(post.body),
                      authorId,
                  },
                  pageUrl
              ),
              createBreadcrumbSchema([
                  ['Home', canonicalUrl('/en')],
                  ['Blog', canonicalUrl('/blog')],
                  [post.title, pageUrl],
              ]),
          ]
        : [];

    const pageMetaTags = Object.freeze({
        title: metaTitle,
        description: metaDescription,
        canonical: pageUrl,
        ...(noIndex && { robots: 'noindex,follow' }),
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: pageUrl,
            type: 'article',
            article: {
                publishedTime,
                modifiedTime,
                authors: [canonicalUrl(`/about/${authorId}`)],
                tags,
            },
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
