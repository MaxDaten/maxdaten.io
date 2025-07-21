import type { MetaTagsProps, Twitter } from 'svelte-meta-tags';
import { description, title } from '$lib/data/meta';
import pagePreviewSrc from '$assets/images/site/home-preview.png?as=run';

export const prerender = true;

export const load = ({ url }) => {
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
                    url: pagePreviewSrc.img.src,
                    alt: 'maxdaten.io site preview',
                    width: 1200,
                    height: 800,
                    secureUrl: pagePreviewSrc.img.src,
                    type: 'image/jpg',
                },
            ],
        },
        twitter: {
            cardType: 'summary_large_image',
            title,
            description,
            image: pagePreviewSrc.img.src,
            imageAlt: 'maxdaten.io site preview',
        } as Twitter,
    }) satisfies MetaTagsProps;

    return {
        baseMetaTags,
    };
};
