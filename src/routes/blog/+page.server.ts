import { filteredPosts } from '$lib/data/blog-posts';
import type { MetaTagsProps } from 'svelte-meta-tags';

export async function load() {
    const pageMetaTags = Object.freeze({
        title: 'Blog',
        description:
            'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        openGraph: {
            title: 'Blog',
            description:
                'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        },
        twitter: {
            title: 'Blog',
            description:
                'DevOps insights, cloud infrastructure tutorials, and software development best practices. Explore articles on Kubernetes, NixOS, Terraform, and modern development workflows.',
        },
    }) satisfies MetaTagsProps;

    return {
        posts: filteredPosts,
        pageMetaTags,
    };
}
