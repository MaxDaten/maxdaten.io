import { defineType, defineField, defineArrayMember } from 'sanity';
import { FileTextIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

/**
 * Blog post document schema.
 * Full-featured content type with Portable Text body, metadata, and SEO fields.
 */
export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    icon: FileTextIcon,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'meta', title: 'Metadata' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        // Content group
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            description:
                'URL-safe identifier, auto-generated from title (e.g., "my-post-title")',
            options: {
                source: 'title',
                slugify: (input: string) =>
                    input
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            group: 'content',
            description: 'Brief summary for listings and SEO (max 300 chars)',
            validation: (rule) => rule.required().max(300),
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            group: 'content',
            of: [
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                            { title: 'Underline', value: 'underline' },
                            { title: 'Strike', value: 'strike-through' },
                            { title: 'Code', value: 'code' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'External Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                        validation: (rule) =>
                                            rule.uri({
                                                scheme: [
                                                    'http',
                                                    'https',
                                                    'mailto',
                                                ],
                                            }),
                                    },
                                ],
                            },
                            {
                                name: 'internalLink',
                                type: 'object',
                                title: 'Internal Link',
                                fields: [
                                    {
                                        name: 'reference',
                                        type: 'reference',
                                        to: [{ type: 'post' }, { type: 'gem' }],
                                    },
                                ],
                            },
                        ],
                    },
                }),
                defineArrayMember({ type: 'codeBlock' }),
                defineArrayMember({ type: 'callout' }),
                defineArrayMember({ type: 'portableImage' }),
                defineArrayMember({ type: 'youtubeEmbed' }),
            ],
        }),
        // Meta group
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            group: 'meta',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }),
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'date',
            title: 'Publish Date',
            type: 'datetime',
            group: 'meta',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lastModified',
            title: 'Last Modified',
            type: 'datetime',
            group: 'meta',
            description: 'Set when making significant content updates',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'meta',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'meta',
            of: [{ type: 'reference', to: [{ type: 'tag' }] }],
        }),
        defineField({
            name: 'series',
            title: 'Series',
            type: 'reference',
            to: [{ type: 'series' }],
            group: 'meta',
        }),
        defineField({
            name: 'hidden',
            title: 'Hidden',
            type: 'boolean',
            group: 'meta',
            initialValue: false,
            description: 'Hide from public listings',
        }),
        // SEO group
        defineField({
            name: 'keywords',
            title: 'SEO Keywords',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'Keywords for search engines (separate from tags)',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Overrides',
            type: 'seo',
            group: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            date: 'date',
            media: 'coverImage',
            hidden: 'hidden',
        },
        prepare({ title, date, media, hidden }) {
            return {
                title: hidden ? `[Hidden] ${title}` : title,
                subtitle: date
                    ? new Date(date).toLocaleDateString()
                    : 'No date',
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Publish Date, Newest',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
        },
        {
            title: 'Publish Date, Oldest',
            name: 'dateAsc',
            by: [{ field: 'date', direction: 'asc' }],
        },
    ],
});
