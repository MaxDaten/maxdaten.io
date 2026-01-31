// Base values for meta tags
// So they can be added as suffixes on different pages
// Via <svelte:head>

import { authors } from './authors';
import MeSrc from '$assets/images/authors/jloos.png?as=run&fit=cover';
import type { BlogPost } from '$lib/utils/types';
import type {
    BlogPosting,
    Organization,
    Person,
    ProfilePage,
    WebSite,
    WithContext,
} from 'schema-dts';
import { getCoverBySlug } from '$utils/image-loader';

export const siteBaseUrl = 'https://maxdaten.io';

export const description =
    'Full-stack product engineering with knowledge transfer built in. 15+ years scaling systems from startup to 100M+ requests/day. K8s, Multi-Cloud, GitOps.';

export const title = 'Jan-Philip Loos | maxdaten.io';

export const baseSchema: [WebSite, Person, ProfilePage, Organization] = [
    <WithContext<WebSite>>{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://maxdaten.io/#website',
        name: 'maxdaten.io',
        description,
        url: siteBaseUrl,
        author: {
            '@id': 'https://maxdaten.io/#jloos',
        },
    },
    <WithContext<Person>>{
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': 'https://maxdaten.io/#jloos',
        name: authors.jloos.name,
        jobTitle: authors.jloos.tagline,
        description: authors.jloos.bio,
        url: `${siteBaseUrl}`,
        sameAs: Object.values(authors.jloos.socials || {}).filter(
            (url) => !url.startsWith('mailto:')
        ),
    },
    <WithContext<ProfilePage>>{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': 'https://maxdaten.io/#profile',
        url: `${siteBaseUrl}`,
        inLanguage: 'en-US',
        mainEntity: {
            '@id': 'https://maxdaten.io/#jloos',
        },
        image: `https://maxdaten.io${MeSrc?.img.src}`,
    },
    <WithContext<Organization>>{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://maxdaten.io/#organization',
        name: 'maxdaten.io',
        url: siteBaseUrl,
        founder: {
            '@id': 'https://maxdaten.io/#jloos',
        },
        description: 'Full-stack product engineering and technical advisory',
    },
];

// Simple mapping function for blog posts (not a complex generator)
export function createBlogPostingSchema(
    post: BlogPost,
    siteUrl: string
): WithContext<BlogPosting> {
    const coverImageSrc = getCoverBySlug(post.slug)?.img.src;
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        keywords: post.tags,
        ...(coverImageSrc && {
            image: `https://maxdaten.io${coverImageSrc}`,
        }),
        url: `${siteUrl}/${post.slug}`,
        ...(post.authorId && {
            author: {
                '@id': `https://maxdaten.io/#${post.authorId}`,
            },
        }),
        publisher: {
            '@id': 'https://maxdaten.io/#organization',
        },
        ...(post.readingTimeMinutes && {
            wordCount: post.readingTimeMinutes * 200, // estimate
            timeRequired: `PT${post.readingTimeMinutes}M`,
        }),
    };
}
