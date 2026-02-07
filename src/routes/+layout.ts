import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { getBaseSchema } from '$lib/data/meta';
import { version } from '$app/environment';
import {
    t,
    getLocaleFromPath,
    isTranslatedRoute,
    localeDomains,
    getSiteBaseUrl,
    type Locale,
} from '$lib/i18n';

export const prerender = true;

const germanKeywords = [
    'Jan-Philip Loos',
    'DevOps Berater',
    'Freelancer Hamburg',
    'Kubernetes Consulting',
    'Technische Beratung',
    'Platform Engineering',
    'Skalierung',
    'Produktentwicklung',
    'Full-Stack Entwicklung',
    'Software Architektur',
    'GitOps',
    'Cloud Infrastruktur',
];

const englishKeywords = [
    'Jan-Philip Loos',
    'Technical Product Advisor',
    'Full-Stack Product Engineering',
    'Kubernetes at Scale',
    'Multi-Cloud Architecture',
    'GitOps',
    'Software Architecture',
    'Knowledge Transfer',
    'Freelance Consultant',
    'Hamburg Developer',
    'Platform Engineering',
    'Developer Experience',
    'System Architecture',
    'Product Engineering',
    'Enterprise Deployments',
];

export const load = ({ url }) => {
    const locale: Locale = getLocaleFromPath(url.pathname);
    const localeBaseUrl = getSiteBaseUrl(locale);
    const ogImageUrl = new URL(
        `/og.jpg?locale=${locale}&v=${version}`,
        url.origin
    ).href;

    const description = t(locale, 'meta.description');
    const title = t(locale, 'meta.title');
    const ogImageAlt = t(locale, 'meta.ogImageAlt');
    const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
    const siteName = locale === 'de' ? 'maxdaten.de' : 'maxdaten.io';
    const canonicalUrl = new URL(url.pathname, localeBaseUrl).href;

    // hreflang link tags for translated pages
    const additionalLinkTags = isTranslatedRoute(url.pathname)
        ? [
              {
                  rel: 'alternate',
                  hreflang: 'de',
                  href: `${localeDomains.de}/`,
              },
              {
                  rel: 'alternate',
                  hreflang: 'en',
                  href: `${localeDomains.en}/`,
              },
              {
                  rel: 'alternate',
                  hreflang: 'x-default',
                  href: `${localeDomains.de}/`,
              },
          ]
        : [];

    const baseMetaTags = Object.freeze({
        title: 'Jan-Philip Loos',
        titleTemplate: `%s | ${siteName}`,
        description,
        keywords: locale === 'de' ? germanKeywords : englishKeywords,
        canonical: canonicalUrl,
        additionalLinkTags,
        openGraph: {
            type: 'website',
            url: canonicalUrl,
            locale: ogLocale,
            title,
            description,
            siteName,
            images: [
                {
                    url: ogImageUrl,
                    alt: ogImageAlt,
                    width: 1200,
                    height: 630,
                    secureUrl: ogImageUrl,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            cardType: 'summary_large_image',
            title,
            description,
            image: ogImageUrl,
            imageAlt: ogImageAlt,
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        baseMetaTags,
        baseSchema: getBaseSchema(locale),
    };
};
