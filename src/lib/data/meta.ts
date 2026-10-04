// Base values for meta tags
// So they can be added as suffixes on different pages
// Via <svelte:head>

import MeSrc from '#lib/assets/images/authors/jloos.png?enhanced';
import type { Author } from '#lib/utils/types.js';
import type {
    BlogPosting,
    BreadcrumbList,
    Organization,
    Person,
    ProfessionalService,
    ProfilePage,
    WebSite,
    WithContext,
} from 'schema-dts';
import { canonicalUrl, type Locale } from '#lib/i18n/index.js';

export const siteBaseUrl = 'https://www.maxdaten.io';

export const description =
    'Full-stack product engineering with knowledge transfer built in. 15+ years spanning product development, platform architecture, and technical leadership — from startup to 100M+ requests/day.';

export const title = 'Jan-Philip Loos | maxdaten.io';

const portraitUrl = `${siteBaseUrl}${MeSrc?.img.src}`;

/** The author bio lives in Sanity in English; this is its German translation. */
const germanPersonDescription =
    'Jan-Philip Loos ist Freelance Platform & Product Engineer in Hamburg. Seit über 15 Jahren baut er Produkte und die Plattformen, auf denen sie laufen — von der Mitgründung der Briends GmbH, dem Unternehmen hinter Papego, bis zu Systemen mit 100M+ Requests am Tag. Er schreibt über Platform Engineering, Nix und Continuous Delivery.';

const organizationDescriptions: Record<Locale, string> = {
    de: 'Full-Stack Produktentwicklung und technische Beratung',
    en: 'Full-stack product engineering and technical advisory',
};

export function getBaseSchema(
    locale: Locale,
    author: Author
): [WebSite, Person, Organization, ProfessionalService] {
    // One name and URL per entity, whatever the page language: answer engines merge entities
    // by @id and distrust ones whose properties disagree.
    const entityName = 'maxdaten.io';
    const desc = {
        person: locale === 'de' ? germanPersonDescription : (author.bio ?? ''),
        organization: organizationDescriptions[locale],
    };

    return [
        <WithContext<WebSite>>{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://maxdaten.io/#website',
            name: entityName,
            description: desc.organization,
            url: siteBaseUrl,
            author: {
                '@id': 'https://maxdaten.io/#jloos',
            },
        },
        <WithContext<Person>>{
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': 'https://maxdaten.io/#jloos',
            name: author.name,
            jobTitle: author.jobTitle,
            description: desc.person,
            url: siteBaseUrl,
            image: portraitUrl,
            knowsAbout: author.specialties,
            // Public profiles only: not the mailto: or the Signal contact link.
            sameAs: Object.values(author.socials || {}).filter(
                (url) =>
                    url.startsWith('https://') && !url.includes('signal.me')
            ),
        },
        <WithContext<Organization>>{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://maxdaten.io/#organization',
            name: entityName,
            url: siteBaseUrl,
            founder: {
                '@id': 'https://maxdaten.io/#jloos',
            },
            description: desc.organization,
        },
        <WithContext<ProfessionalService>>{
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            '@id': 'https://maxdaten.io/#business',
            name: entityName,
            description: desc.organization,
            url: siteBaseUrl,
            founder: {
                '@id': 'https://maxdaten.io/#jloos',
            },
            employee: {
                '@id': 'https://maxdaten.io/#jloos',
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Hamburg',
                addressRegion: 'Hamburg',
                addressCountry: 'DE',
                postalCode: '22043',
            },
            areaServed: [
                { '@type': 'Country', name: 'Germany' },
                { '@type': 'Country', name: 'Austria' },
                { '@type': 'Country', name: 'Switzerland' },
            ],
            priceRange: '$$$$',
            currenciesAccepted: 'EUR',
            knowsLanguage: ['de', 'en'],
        },
    ];
}

/**
 * The site author's about page is their ProfilePage. Only that page says so: on every other
 * page it would claim the page itself is a profile.
 */
export function createProfilePageSchema(): WithContext<ProfilePage> {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': 'https://maxdaten.io/#profile',
        url: canonicalUrl('/about/jloos'),
        inLanguage: 'en-US',
        mainEntity: {
            '@id': 'https://maxdaten.io/#jloos',
        },
        image: portraitUrl,
    };
}

/** What a BlogPosting needs to know about a post. */
export type BlogPostingInput = {
    title: string;
    date: string;
    updated: string;
    excerpt: string;
    tags: string[];
    image: string;
    wordCount?: number;
    readingTimeMinutes?: number;
    authorId?: string;
};

// Simple mapping function for blog posts (not a complex generator)
export function createBlogPostingSchema(
    post: BlogPostingInput,
    pageUrl: string
): WithContext<BlogPosting> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        keywords: post.tags,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        image: post.image,
        inLanguage: 'en',
        ...(post.authorId && {
            author: {
                '@id': `https://maxdaten.io/#${post.authorId}`,
            },
        }),
        publisher: {
            '@id': 'https://maxdaten.io/#organization',
        },
        ...(post.wordCount && { wordCount: post.wordCount }),
        ...(post.readingTimeMinutes && {
            timeRequired: `PT${post.readingTimeMinutes}M`,
        }),
    };
}

/** BreadcrumbList from [name, url] pairs, outermost first. */
export function createBreadcrumbSchema(
    trail: [name: string, url: string][]
): WithContext<BreadcrumbList> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map(([name, item], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name,
            item,
        })),
    };
}
