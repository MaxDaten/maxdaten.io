import type { Component } from 'svelte';
import type { PortableTextBlock } from '@portabletext/types';

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

export type Author = {
    id: string;
    name: string;
    tagline?: string;
    role?: string;
    bio?: string;
    specialties?: string[];
    avatarUrl?: string;
    avatarAlt?: string;
    socials?: {
        github?: string;
        linkedin?: string;
        email?: string;
        twitter?: string;
        website?: string;
    };
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
    content: Component;
    authorId?: string;
};

export type GemEntry = {
    title: string;
    description: string;
    tags: string[];
    link: string;
    coverImage: string;
};

/**
 * Sanity post type matching the GROQ query projection.
 */
export type SanityPost = {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    body: PortableTextBlock[]; // Portable Text array
    date: string;
    lastModified?: string;
    hidden?: boolean;
    keywords?: string[];
    author?: {
        name: string;
        bio?: string;
        email?: string;
        avatarUrl?: string;
        avatarAlt?: string;
        socialLinks?: {
            twitter?: string;
            github?: string;
            linkedin?: string;
            website?: string;
        };
    };
    tags?: Array<{
        name: string;
        slug: string;
    }>;
    coverImage?: {
        alt?: string;
        caption?: string;
        url?: string;
        lqip?: string;
        dimensions?: {
            width: number;
            height: number;
            aspectRatio: number;
        };
        hotspot?: {
            x: number;
            y: number;
        };
        crop?: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
    };
};

/**
 * Post data from Sanity CMS.
 * Used by [slug] route for rendering.
 */
export type PostData = { source: 'sanity'; post: SanityPost };
