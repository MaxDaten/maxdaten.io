import {
    createImageUrlBuilder,
    type SanityImageSource,
} from '@sanity/image-url';
import {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
} from '$app/env/public';

// Image URLs need only the project and dataset. Passing the client instead would ship the whole
// @sanity/client to the browser on every page that renders an image.
const builder = createImageUrlBuilder({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET || 'production',
});

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

/**
 * URL for a square avatar shown at `displaySize` CSS pixels: cropped, in a modern
 * format, and at 2x for high-density screens instead of the full-size upload.
 *
 * @example
 * <img src={avatarUrl(author.avatarUrl, 36)} width="36" height="36" />
 */
export function avatarUrl(
    source: SanityImageSource,
    displaySize: number
): string {
    const size = displaySize * 2;
    return urlFor(source)
        .width(size)
        .height(size)
        .fit('crop')
        .auto('format')
        .url();
}
