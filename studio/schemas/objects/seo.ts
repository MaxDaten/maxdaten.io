import { defineType, defineField } from 'sanity';

/**
 * SEO metadata object for blog posts.
 * Provides optional overrides for title, description, and OG image.
 */
export const seoType = defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title Override',
            type: 'string',
            description:
                'Override the default title for search engines (max 60 chars)',
            validation: (rule) => rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description Override',
            type: 'text',
            rows: 3,
            description: 'Override excerpt for search engines (max 155 chars)',
            validation: (rule) => rule.max(155),
        }),
        defineField({
            name: 'ogImage',
            title: 'Open Graph Image Override',
            type: 'image',
            description: 'Override cover image for social sharing',
            options: { hotspot: true },
        }),
        defineField({
            name: 'noIndex',
            title: 'No Index',
            type: 'boolean',
            description: 'Prevent search engines from indexing this page',
            initialValue: false,
        }),
    ],
});
