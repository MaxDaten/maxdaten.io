/**
 * Dynamic image loader for blog post covers using svelte-img
 *
 * This utility solves the challenge of using svelte-img with dynamic blog post covers
 * by pre-importing all post cover images and creating a lookup function.
 */

const blogPostImages = new Map<string, unknown>(
    Object.entries(
        import.meta.glob('$assets/images/posts/**/*.{png,jpg,jpeg,webp}', {
            import: 'default',
            eager: true,
            query: { as: 'run', fit: 'cover' },
        })
    ).filter(([path]) => !path.includes('/cover.'))
);

// Import all post cover images with svelte-img optimization
const postCoverImagesBySlug = new Map<string, unknown>(
    Object.entries(
        import.meta.glob('$assets/images/posts/**/cover.{png,jpg,jpeg,webp}', {
            import: 'default',
            eager: true,
            query: { as: 'run', fit: 'cover' },
        })
    ).map(([path, image]) => {
        return [path.match(/posts\/([^/]+)\//)?.[1] || '', image];
    })
);

/**
 * Get optimized image object for a blog post cover
 * @param postSlug - Path from blog post frontmatter
 *   Format: "src/lib/assets/images/posts/{slug}/cover.png"
 * @returns Optimized image object for use with svelte-img component, or null if not found
 */
export function getCoverBySlug(postSlug: string): unknown | null {
    return postCoverImagesBySlug.get(postSlug);
}

export function getPostImageByPath(path: string): unknown | null {
    return blogPostImages.get(path);
}
