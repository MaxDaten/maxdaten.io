import { defineType, defineField } from 'sanity';
import { LayersIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

export const seriesType = defineType({
    name: 'series',
    title: 'Series',
    type: 'document',
    icon: LayersIcon,
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
            description: 'URL-safe identifier, auto-generated from title',
            options: {
                source: 'title',
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'coverImage',
        },
    },
});
