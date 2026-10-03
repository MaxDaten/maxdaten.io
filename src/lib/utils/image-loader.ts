/**
 * Author avatars bundled with the site, optimised by @sveltejs/enhanced-img.
 * Used as a fallback when an author has no avatar in Sanity.
 */

import type { Picture } from '@sveltejs/enhanced-img';

const authorAvatars = new Map<string, Picture>(
    Object.entries(
        import.meta.glob('$assets/images/authors/*.{png,jpg,jpeg,webp}', {
            import: 'default',
            eager: true,
            query: { enhanced: true, w: '100' },
        }) as Record<string, Picture>
    ).map(([path, image]) => {
        // Author ID from the filename, e.g. "jloos.png" -> "jloos"
        const authorId =
            path
                .split('/')
                .pop()
                ?.replace(/\.(png|jpg|jpeg|webp)$/, '') || '';
        return [authorId, image];
    })
);

/**
 * Get the optimised avatar for an author.
 * @param authorId - The author's ID
 * @returns Picture for <enhanced:img>, or null if not found
 */
export function getAuthorAvatar(authorId: string): Picture | null {
    return authorAvatars.get(authorId) || null;
}
