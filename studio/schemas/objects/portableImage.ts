import { defineType, defineField } from 'sanity';
import { ImageIcon } from 'lucide-react';

/**
 * Image block for Portable Text with alt text and caption.
 * Used for inline images in blog post body content.
 * Alt text is required for accessibility.
 */
export const portableImageType = defineType({
    name: 'portableImage',
    title: 'Image',
    type: 'object',
    icon: ImageIcon,
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Descriptive text for accessibility (required)',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
            description: 'Optional caption displayed below the image',
        }),
    ],
    preview: {
        select: {
            alt: 'alt',
            media: 'image',
        },
        prepare({ alt, media }) {
            return {
                title: alt || 'Image',
                media,
            };
        },
    },
});
