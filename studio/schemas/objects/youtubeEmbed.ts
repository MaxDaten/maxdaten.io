import { defineType, defineField } from 'sanity';
import { PlayCircleIcon } from 'lucide-react';

/**
 * YouTube video embed for Portable Text.
 * URL must be a valid YouTube link (youtube.com or youtu.be).
 */
export const youtubeEmbedType = defineType({
    name: 'youtubeEmbed',
    title: 'YouTube Video',
    type: 'object',
    icon: PlayCircleIcon,
    fields: [
        defineField({
            name: 'url',
            title: 'YouTube URL',
            type: 'url',
            description: 'Full YouTube video URL (youtube.com or youtu.be)',
            validation: (rule) =>
                rule
                    .required()
                    .uri({ scheme: ['https'] })
                    .custom((url) => {
                        if (!url) return true;
                        const isYouTube =
                            url.includes('youtube.com') ||
                            url.includes('youtu.be');
                        return isYouTube || 'URL must be a YouTube link';
                    }),
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Optional accessibility title for the video',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            url: 'url',
        },
        prepare({ title, url }) {
            return {
                title: title || 'YouTube Video',
                subtitle: url,
            };
        },
    },
});
