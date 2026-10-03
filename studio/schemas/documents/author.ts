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
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'Author page path: /about/<slug>',
            options: { source: 'name' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'jobTitle',
            title: 'Job Title',
            type: 'string',
            description:
                'Used for the structured data, the author page and llms.txt',
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description:
                'Closing pitch shown under posts without their own outro text',
            validation: (rule) => rule.max(200),
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 4,
            description: 'Short biography (plain text)',
        }),
        defineField({
            name: 'specialties',
            title: 'Specialties',
            type: 'array',
            of: [{ type: 'string' }],
            description:
                'Expertise list (structured data knowsAbout, author page)',
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
                    name: 'cv',
                    title: 'CV',
                    type: 'url',
                    validation: (rule) =>
                        rule.uri({ scheme: ['http', 'https'] }),
                }),
                defineField({
                    name: 'signal',
                    title: 'Signal',
                    type: 'url',
                    validation: (rule) => rule.uri({ scheme: ['https'] }),
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
        defineField({
            name: 'calendarBookingUrl',
            title: 'Calendar Booking URL',
            type: 'url',
            description:
                'Link to calendar booking page (e.g., Cal.com, Calendly, Google Calendar)',
            validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'avatar',
        },
    },
});
