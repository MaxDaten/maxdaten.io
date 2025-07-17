/**
 * Dynamic image loader for blog post covers using svelte-img
 *
 * This utility solves the challenge of using svelte-img with dynamic blog post covers
 * by pre-importing all post cover images and creating a lookup function.
 */

// Import all post cover images with svelte-img optimization
// Now supports nested directory structure: /posts/{slug}/cover.{ext}
const postCoverImages = import.meta.glob(
    '$assets/images/posts/*/cover.{png,jpg,jpeg,webp}',
    {
        import: 'default',
        eager: true,
        query: { as: 'run', fit: 'cover' },
    }
);

// Create a lookup map: filename -> optimized image object
const imageMap = new Map<string, unknown>();

for (const path in postCoverImages) {
    // Extract slug and filename from nested path: $assets/images/posts/my-post/cover.png
    const matches = path.match(/posts\/([^/]+)\/(cover\.[^.]+)$/);
    if (matches) {
        const [, slug, filename] = matches;
        // Store with slug/filename key for lookup
        imageMap.set(`${slug}/${filename}`, postCoverImages[path]);
        // Also store with just filename for backwards compatibility during migration
        imageMap.set(filename, postCoverImages[path]);
    }
}

/**
 * Get optimized image object for a blog post cover
 * @param coverImagePath - Path from blog post frontmatter
 *   Supports both old format: "src/lib/assets/images/posts/cover-sops.png"
 *   And new format: "src/lib/assets/images/posts/my-post/cover.png"
 * @returns Optimized image object for use with svelte-img component, or null if not found
 */
export function getOptimizedCoverImage(
    coverImagePath: string | undefined
): unknown | null {
    if (!coverImagePath) return null;

    // Try to extract slug/filename from new nested structure
    const nestedMatches = coverImagePath.match(/posts\/([^/]+\/cover\.[^.]+)$/);
    if (nestedMatches) {
        return imageMap.get(nestedMatches[1]) || null;
    }

    // Fallback to old flat structure for backwards compatibility
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

    // Try nested structure first
    const nestedMatches = coverImagePath.match(/posts\/([^/]+\/cover\.[^.]+)$/);
    if (nestedMatches) {
        return imageMap.has(nestedMatches[1]);
    }

    // Fallback to flat structure
    const filename = coverImagePath.split('/').pop();
    return filename ? imageMap.has(filename) : false;
}
