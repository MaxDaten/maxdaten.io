import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { description, title } from '$lib/data/meta';

export const prerender = true;

export const load = ({ url }) => {
    const ogImageUrl = new URL('/og.jpg', url.origin).href;

    const baseMetaTags = Object.freeze({
        title: 'Jan-Philip Loos',
        titleTemplate: '%s | maxdaten.io',
        description,
        keywords: [
            'Jan-Philip Loos',
            'DevOps Consultant',
            'Cloud Infrastructure',
            'Kubernetes Expert',
            'Google Cloud Platform',
            'Infrastructure as Code',
            'Software Architecture',
            'DevOps Automation',
            'Freelance Consultant',
            'Hamburg Developer',
            'NixOS',
            'Terraform',
            'CI/CD Optimization',
            'Secret Management',
            'System Architecture',
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
                    alt: 'Jan-Philip Loos | maxdaten.io profile card',
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
            imageAlt: 'Jan-Philip Loos | maxdaten.io profile card',
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        baseMetaTags,
    };
};
