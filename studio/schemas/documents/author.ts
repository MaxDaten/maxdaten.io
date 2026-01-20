import { defineType, defineField } from 'sanity';
import { UserIcon } from 'lucide-react';

export const authorType = defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 4,
            description: 'Short biography (plain text)',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (rule) =>
                rule.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
                    name: 'email',
                    invert: false,
                }),
            description: 'Contact email address',
        }),
        defineField({
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }),
            ],
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'object',
            fields: [
                defineField({
                    name: 'twitter',
                    title: 'Twitter/X',
                    type: 'url',
                    validation: (rule) =>
                        rule.uri({ scheme: ['http', 'https'] }),
                }),
                defineField({
                    name: 'github',
                    title: 'GitHub',
                    type: 'url',
                    validation: (rule) =>
                        rule.uri({ scheme: ['http', 'https'] }),
                }),
                defineField({
                    name: 'linkedin',
                    title: 'LinkedIn',
                    type: 'url',
                    validation: (rule) =>
                        rule.uri({ scheme: ['http', 'https'] }),
                }),
                defineField({
                    name: 'website',
                    title: 'Website',
                    type: 'url',
                    validation: (rule) =>
                        rule.uri({ scheme: ['http', 'https'] }),
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'avatar',
        },
    },
});
