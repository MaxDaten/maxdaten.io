/**
 * Shared profile image loading for OG card generation
 */

/**
 * Load the profile image source URL
 */
export async function loadProfileImageSrc(): Promise<string | undefined> {
    try {
        const module = await import('$assets/images/authors/jloos-v2.jpeg?url');
        return module.default;
    } catch (_err) {
        console.warn('Profile image not found, proceeding without image');
        return undefined;
    }
}

/**
 * Process image URL to ensure it's absolute
 */
export function toAbsoluteUrl(imageSrc: string, baseUrl: URL): string {
    return imageSrc.startsWith('http')
        ? imageSrc
        : new URL(imageSrc, baseUrl.origin).href;
}

/**
 * Load profile image as absolute URL
 */
export async function loadProfileImageUrl(
    baseUrl: URL
): Promise<string | undefined> {
    const src = await loadProfileImageSrc();
    return src ? toAbsoluteUrl(src, baseUrl) : undefined;
}
