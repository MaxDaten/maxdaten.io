import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { description, title, baseSchema } from '$lib/data/meta';

export const prerender = true;

export const load = ({ url }) => {
    const ogImageUrl = new URL('/og.jpg', url.origin).href;

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
        openGraph: {
            type: 'website',
            url: new URL(url.pathname, url.origin).href,
            locale: 'en_US',
            title,
            description,
            siteName: 'maxdaten.io',
            images: [
                {
                    url: ogImageUrl,
                    alt: 'Jan-Philip Loos - Products that ship. Systems that scale.',
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
            imageAlt:
                'Jan-Philip Loos - Products that ship. Systems that scale.',
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        baseMetaTags,
        baseSchema,
    };
};
