// Base values for meta tags
// So they can be added as suffixes on different pages
// Via <svelte:head>

import { authors } from './authors';
import MeSrc from '#lib/assets/images/authors/jloos.png?enhanced';
import type { BlogPost } from '#lib/utils/types.js';
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
import { getSiteBaseUrl, type Locale } from '#lib/i18n/index.js';

export const siteBaseUrl = 'https://www.maxdaten.io';

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
): [WebSite, Person, ProfilePage, Organization, ProfessionalService] {
    const localeBaseUrl = getSiteBaseUrl(locale);
    const inLanguage = locale === 'de' ? 'de-DE' : 'en-US';
    // One name and URL per entity, whatever the page language: answer engines merge entities
    // by @id and distrust ones whose properties disagree.
    const entityName = 'maxdaten.io';
    const portraitUrl = `${siteBaseUrl}${MeSrc?.img.src}`;
    const desc = descriptions[locale];

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
            name: authors.jloos.name,
            jobTitle: authors.jloos.tagline,
            description: desc.person,
            url: siteBaseUrl,
            image: portraitUrl,
            knowsAbout: authors.jloos.specialties,
            // Public profiles only: not the mailto: or the Signal contact link.
            sameAs: Object.values(authors.jloos.socials || {}).filter(
                (url) =>
                    url.startsWith('https://') && !url.includes('signal.me')
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
            image: portraitUrl,
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

// Simple mapping function for blog posts (not a complex generator)
export function createBlogPostingSchema(
    post: BlogPost,
    pageUrl: string,
    image: string
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
        image,
        inLanguage: 'en',
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
