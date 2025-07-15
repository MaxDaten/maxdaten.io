/**
 * Dynamic image loader for blog post covers using svelte-img
 *
 * This utility solves the challenge of using svelte-img with dynamic blog post covers
 * by pre-importing all post cover images and creating a lookup function.
 */

// Import all post cover images with svelte-img optimization
const postCoverImages = import.meta.glob(
    '$assets/images/posts/*.{png,jpg,jpeg,webp}',
    {
        import: 'default',
        eager: true,
        query: { as: 'run', fit: 'cover' },
    }
);

// Create a lookup map: filename -> optimized image object
const imageMap = new Map<string, unknown>();

for (const path in postCoverImages) {
    // Extract filename from path: /static/images/posts/cover-sops.png -> cover-sops.png
    const filename = path.split('/').pop();
    if (filename) {
        imageMap.set(filename, postCoverImages[path]);
    }
}

/**
 * Get optimized image object for a blog post cover
 * @param coverImagePath - Path from blog post frontmatter (e.g., "/images/posts/cover-sops.png")
 * @returns Optimized image object for use with svelte-img component, or null if not found
 */
export function getOptimizedCoverImage(
    coverImagePath: string | undefined
): unknown | null {
    if (!coverImagePath) return null;

    // Extract filename from path: /images/posts/cover-sops.png -> cover-sops.png
    const filename = coverImagePath.split('/').pop();
    if (!filename) return null;

    return imageMap.get(filename) || null;
}

/**
 * Check if an optimized version of the cover image exists
 * @param coverImagePath - Path from blog post frontmatter
 * @returns true if optimized image exists, false otherwise
 */
export function hasOptimizedCoverImage(
    coverImagePath: string | undefined
): boolean {
    if (!coverImagePath) return false;

    const filename = coverImagePath.split('/').pop();
    return filename ? imageMap.has(filename) : false;
}
