import type { SlugIsUniqueValidator } from 'sanity';

/**
 * Validates that a slug is unique across ALL document types in the dataset.
 * This ensures global uniqueness for URL routing (no two documents can have the same slug).
 *
 * Used by: tag, author, series, post, gem schemas
 */
export const isUniqueAcrossAllDocuments: SlugIsUniqueValidator = async (
    slug,
    context
) => {
    const { document, getClient } = context;
    const client = getClient({ apiVersion: '2025-01-18' });

    if (!document?._id) {
        return true; // New documents without ID are valid
    }

    const id = document._id;

    // Handle draft document IDs by extracting the published ID
    const publishedId = id.replace(/^drafts\./, '');
    const draftId = `drafts.${publishedId}`;

    // Query all documents (not filtered by type) that have this slug,
    // excluding the current document's draft and published versions
    const query = `!defined(*[
        !(_id in [$draft, $published]) &&
        slug.current == $slug
    ][0]._id)`;

    const result = await client.fetch(query, {
        slug,
        draft: draftId,
        published: publishedId,
    });

    return result;
};
