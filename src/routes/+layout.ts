import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { getBaseSchema } from '#lib/data/meta.js';
import { version } from '$app/env';
import {
    t,
    getLocaleFromPath,
    isTranslatedRoute,
    localeDomains,
    canonicalUrl as toCanonicalUrl,
    type Locale,
} from '#lib/i18n/index.js';

export const prerender = true;

export const load = ({ url }) => {
    const locale: Locale = getLocaleFromPath(url.pathname);
    const ogImageUrl = new URL(`/og/${locale}.jpg?v=${version}`, url.origin)
        .href;

    const description = t(locale, 'meta.description');
    const title = t(locale, 'meta.title');
    const ogImageAlt = t(locale, 'meta.ogImageAlt');
    const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
    const siteName = locale === 'de' ? 'maxdaten.de' : 'maxdaten.io';
    const canonicalUrl = toCanonicalUrl(url.pathname);

    const rssLinkTag = {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'maxdaten.io blog',
        href: `${localeDomains.en}/rss.xml`,
    };

    // hreflang link tags for translated pages
    const hreflangLinkTags = isTranslatedRoute(url.pathname)
        ? [
              {
                  rel: 'alternate',
                  hreflang: 'de',
                  href: `${localeDomains.de}/`,
              },
              {
                  rel: 'alternate',
                  hreflang: 'en',
                  href: `${localeDomains.en}/en`,
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
        keywords: t(locale, 'meta.keywords').split(', '),
        canonical: canonicalUrl,
        additionalLinkTags: [rssLinkTag, ...hreflangLinkTags],
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
