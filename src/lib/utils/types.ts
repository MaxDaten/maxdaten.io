import type { Component } from 'svelte';

export type SparkleType = {
    id: string;
    createdAt: number;
    color: string;
    size: number;
    style: {
        top: string;
        left: string;
    };
};

export type TagType = {
    label: string;
    color?: 'primary' | 'secondary';
};

export type BlogPost = {
    tags: string[];
    keywords: string[];
    hidden: boolean;
    slug: string;
    title: string;
    date: string;
    updated: string;
    excerpt: string;
    readingTimeMinutes: number | undefined;
    relatedPosts: BlogPost[];
    coverImage: string | undefined;
    content: Component;
};

export type GemEntry = {
    title: string;
    description: string;
    tags: string[];
    link: string;
    coverImage: string;
};
