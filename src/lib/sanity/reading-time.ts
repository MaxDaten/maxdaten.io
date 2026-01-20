import type { PortableTextBlock } from '@portabletext/types';

const WORDS_PER_MINUTE = 200;

/**
 * Extract plain text from Portable Text blocks.
 */
function extractText(blocks: PortableTextBlock[]): string {
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }

    return blocks
        .map((block) => {
            // Handle regular text blocks
            if (block._type === 'block' && Array.isArray(block.children)) {
                return block.children
                    .filter(
                        (child): child is { _type: 'span'; text: string } =>
                            child._type === 'span' &&
                            typeof child.text === 'string'
                    )
                    .map((child) => child.text)
                    .join('');
            }
            // Skip non-text blocks (images, code blocks, etc.)
            return '';
        })
        .join(' ');
}

/**
 * Calculate reading time in minutes from Portable Text blocks.
 * Uses 200 words per minute as the average reading speed.
 */
export function calculateReadingTime(
    blocks: PortableTextBlock[]
): number | undefined {
    const text = extractText(blocks);
    if (!text) {
        return undefined;
    }

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

    return minutes > 0 ? minutes : undefined;
}
