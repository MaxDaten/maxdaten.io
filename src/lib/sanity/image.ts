import {
    createImageUrlBuilder,
    type SanityImageSource,
} from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

/**
 * Build an image URL from a Sanity image reference.
 * Returns a builder that can be chained with transformations.
 *
 * @example
 * urlFor(image).width(800).height(600).url()
 * urlFor(image).auto('format').url()
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

/**
 * Default responsive image widths matching CONTEXT.md breakpoints.
 */
const DEFAULT_SIZES = [320, 640, 960, 1280, 1920];

/**
 * Generate a srcset string for responsive images.
 * Uses auto format for WebP/AVIF based on browser support.
 *
 * @param source - Sanity image reference
 * @param sizes - Array of widths to generate (default: standard breakpoints)
 * @returns srcset string for use in img or source elements
 *
 * @example
 * <img srcset={generateSrcSet(image)} sizes="(max-width: 640px) 100vw, 50vw" />
 */
export function generateSrcSet(
    source: SanityImageSource,
    sizes: number[] = DEFAULT_SIZES
): string {
    return sizes
        .map((w) => `${urlFor(source).width(w).auto('format').url()} ${w}w`)
        .join(', ');
}
