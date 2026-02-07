import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { baseSchema } from '$lib/data/meta';
import { version } from '$app/environment';
import {
    t,
    getLocaleFromPath,
    isTranslatedRoute,
    localeDomains,
    type Locale,
} from '$lib/i18n';

export const prerender = true;

export const load = ({ url }) => {
    const locale: Locale = getLocaleFromPath(url.pathname);
    const ogImageUrl = new URL(`/og.jpg?v=${version}`, url.origin).href;

    const description = t(locale, 'meta.description');
    const title = t(locale, 'meta.title');
    const ogImageAlt = t(locale, 'meta.ogImageAlt');
    const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';

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
        titleTemplate: '%s | maxdaten.io',
        description,
        keywords: [
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
        ],
        canonical: new URL(url.pathname, url.origin).href,
        additionalLinkTags,
        openGraph: {
            type: 'website',
            url: new URL(url.pathname, url.origin).href,
            locale: ogLocale,
            title,
            description,
            siteName: 'maxdaten.io',
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
        baseSchema,
    };
};
