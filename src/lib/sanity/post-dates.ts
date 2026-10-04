type PostDates = {
    date: string;
    lastModified?: string | null;
    _updatedAt?: string | null;
};

/**
 * When a post last changed, for machines (sitemap lastmod, JSON-LD dateModified). Editors rarely
 * set lastModified (shown on the page as "Updated"), so fall back to the document's last edit.
 */
export function postModifiedAt(post: PostDates): string {
    return post.lastModified ?? post._updatedAt ?? post.date;
}
