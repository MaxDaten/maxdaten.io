/** The target of an internalLink mark, as the post query dereferences it. */
export type InternalLinkReference = {
    _type: string;
    slug?: { current?: string };
};

/**
 * Site path of an internal link: a post's own page, or a gem's card on /gems (gems have no page
 * of their own). Undefined when the reference is missing or unpublished.
 */
export function internalLinkPath(
    reference: InternalLinkReference | undefined
): string | undefined {
    const slug = reference?.slug?.current;
    if (!slug) return undefined;
    return reference._type === 'gem' ? `/gems#${slug}` : `/${slug}`;
}
