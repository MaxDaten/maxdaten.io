import { defineType, defineField } from 'sanity';
import { TagIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

export const tagType = defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-safe identifier, auto-generated from name',
            options: {
                source: 'name',
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: { title: 'name' },
    },
});
