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
import { getSiteBaseUrl, type Locale } from '$lib/i18n';

export const siteBaseUrl = 'https://maxdaten.io';

export const description =
    'Full-stack product engineering with knowledge transfer built in. 15+ years spanning product development, platform architecture, and technical leadership — from startup to 100M+ requests/day.';

export const title = 'Jan-Philip Loos | maxdaten.io';

const descriptions: Record<Locale, { person: string; organization: string }> = {
    de: {
        person: 'Software-Ingenieur und DevOps-Berater aus Hamburg. Ich helfe Unternehmen, robuste und skalierbare Produkte und Infrastrukturen aufzubauen.',
        organization: 'Full-Stack Produktentwicklung und technische Beratung',
    },
    en: {
        person: authors.jloos.bio ?? '',
        organization: 'Full-stack product engineering and technical advisory',
    },
};

export function getBaseSchema(
    locale: Locale
): [WebSite, Person, ProfilePage, Organization] {
    const localeBaseUrl = getSiteBaseUrl(locale);
    const inLanguage = locale === 'de' ? 'de-DE' : 'en-US';
    const siteName = locale === 'de' ? 'maxdaten.de' : 'maxdaten.io';
    const desc = descriptions[locale];

    return [
        <WithContext<WebSite>>{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://maxdaten.io/#website',
            name: siteName,
            description: desc.organization,
            url: localeBaseUrl,
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
            description: desc.person,
            url: localeBaseUrl,
            sameAs: Object.values(authors.jloos.socials || {}).filter(
                (url) => !url.startsWith('mailto:')
            ),
        },
        <WithContext<ProfilePage>>{
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': 'https://maxdaten.io/#profile',
            url: localeBaseUrl,
            inLanguage,
            mainEntity: {
                '@id': 'https://maxdaten.io/#jloos',
            },
            image: `https://maxdaten.io${MeSrc?.img.src}`,
        },
        <WithContext<Organization>>{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://maxdaten.io/#organization',
            name: siteName,
            url: localeBaseUrl,
            founder: {
                '@id': 'https://maxdaten.io/#jloos',
            },
            description: desc.organization,
        },
    ];
}

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
