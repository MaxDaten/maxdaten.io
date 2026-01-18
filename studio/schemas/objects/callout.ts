import { defineType, defineField } from 'sanity';
import { InfoIcon, AlertTriangleIcon, LightbulbIcon } from 'lucide-react';

/**
 * Callout/admonition block for Portable Text.
 * Three types: info (default), warning, and tip.
 * Content supports rich text inside the callout.
 */
export const calloutType = defineType({
    name: 'callout',
    title: 'Callout',
    type: 'object',
    icon: InfoIcon,
    fields: [
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Info', value: 'info' },
                    { title: 'Warning', value: 'warning' },
                    { title: 'Tip', value: 'tip' },
                ],
                layout: 'radio',
            },
            initialValue: 'info',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            type: 'type',
            content: 'content',
        },
        prepare({ type, content }) {
            const icons: Record<string, typeof InfoIcon> = {
                info: InfoIcon,
                warning: AlertTriangleIcon,
                tip: LightbulbIcon,
            };
            const text = content?.[0]?.children?.[0]?.text || 'Callout';
            const Icon = icons[type || 'info'] || InfoIcon;
            return {
                title: `${type?.charAt(0).toUpperCase()}${type?.slice(1) || 'Info'}`,
                subtitle: text.slice(0, 50),
                media: Icon,
            };
        },
    },
});
