import { defineType, defineField } from 'sanity';
import { GemIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

/**
 * Gem document schema.
 * Curated link recommendations with manual slug entry.
 * Shares tags with blog posts for unified taxonomy.
 */
export const gemType = defineType({
    name: 'gem',
    title: 'Gem',
    type: 'document',
    icon: GemIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description:
                'URL-safe identifier, manual entry (e.g., "cool-library")',
            options: {
                // No source - manual entry per CONTEXT.md
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            description: 'Link to the recommended resource',
            validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https'] }),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'Plain text description of the recommendation',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'tag' }] }],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            url: 'url',
        },
        prepare({ title, url }) {
            return {
                title,
                subtitle: url,
            };
        },
    },
});
