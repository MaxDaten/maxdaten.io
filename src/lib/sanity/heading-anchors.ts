const headingStyles = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * URL fragment for a heading: lowercase ASCII words joined by dashes. Accented letters keep
 * their base letter ("Übersicht" → "ubersicht") instead of vanishing.
 */
export function headingSlug(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/\p{M}/gu, '')
        .replace(/ß/g, 'ss')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

type Block = { _type: string; style?: string; children?: unknown };

function blockText(block: Block): string {
    const children = (block.children ?? []) as Array<{ text?: string }>;
    return children.map((child) => child.text ?? '').join('');
}

/**
 * Give each top-level heading a unique `_anchor`. Repeated headings get -2, -3, … like GitHub,
 * so every id on the page is unique and each link lands on its own heading.
 */
export function assignHeadingAnchors<T extends Block>(body: T[]): T[] {
    const seen = new Map<string, number>();
    return body.map((block) => {
        if (block._type !== 'block' || !headingStyles.has(block.style ?? '')) {
            return block;
        }
        const base = headingSlug(blockText(block)) || 'section';
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        return { ...block, _anchor: count === 1 ? base : `${base}-${count}` };
    });
}
