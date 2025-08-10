import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that converts GitHub-style Markdown alerts (blockquotes starting with
 * "[!NOTE]", "[!TIP]", etc.) into the project's Svelte component <Components.Callout>.
 *
 * It preserves the rest of the blockquote content and maps GitHub alert kinds to the
 * existing type set supported by the component: info, warning, error, success.
 *
 * This file uses JSDoc for type annotations to improve editor IntelliSense while keeping
 * the implementation in plain JavaScript.
 *
 * Implemented in a more functional style: pure helper functions, no in-place array splices,
 * and minimal reassignment. Unified still passes a mutable tree; we avoid mutating arrays
 * in place and instead replace children immutably where necessary.
 *
 * @see https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Parent} Parent
 * @typedef {import('hast').Text} Text
 */

/**
 * Map GitHub alert keywords to the existing Callout types.
 * Do not extend the type set.
 *
 * @type {Record<'NOTE'|'TIP'|'IMPORTANT'|'WARNING'|'CAUTION', 'info'|'success'|'warning'|'error'>}
 */
const typeMap = {
    NOTE: 'info',
    TIP: 'success',
    IMPORTANT: 'warning',
    WARNING: 'warning',
    CAUTION: 'error',
};

/**
 * Checks whether a node is a Text node.
 *
 * @param {unknown} node
 * @returns {node is Text}
 */
const isTextNode = (node) =>
    Boolean(
        node &&
            /** @type {any} */ (node).type === 'text' &&
            typeof (/** @type {any} */ (node).value) === 'string'
    );

/**
 * Replace an item at index in an array immutably.
 *
 * @template T
 * @param {readonly T[]} arr
 * @param {number} index
 * @param {T} item
 * @returns {T[]}
 */
const replaceAt = (arr, index, item) =>
    arr.map((x, i) => (i === index ? item : x));

/**
 * Build a <Components.Callout> element node.
 *
 * @param {'info'|'success'|'warning'|'error'} type
 * @param {Element['children']} children
 * @returns {Element}
 */
const makeCallout = (type, children) => ({
    type: 'element',
    tagName: 'Components.Callout',
    properties: { type },
    children,
});

/**
 * Extracts a leading "[!TYPE]" marker from the beginning of a paragraph element.
 * If found, returns the mapped callout type and the paragraph children with the marker removed.
 *
 * @param {Element} p
 * @returns {{ type: 'info'|'success'|'warning'|'error', newChildren: Element['children'] } | null}
 */
const extractAlertMarkerFromParagraph = (p) => {
    if (
        !p ||
        p.type !== 'element' ||
        p.tagName !== 'p' ||
        !Array.isArray(p.children)
    )
        return null;

    const first = /** @type {any} */ (p.children[0]);
    if (!isTextNode(first)) return null;

    const match = first.value.match(
        /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]\s*/i
    );
    if (!match) return null;

    const raw = match[0];
    const keyword = match[1].toUpperCase();
    const mapped = typeMap[/** @type {keyof typeof typeMap} */ (keyword)];
    if (!mapped) return null;

    const remainder = first.value.slice(raw.length);
    const newFirst =
        remainder.length > 0 ? { ...first, value: remainder } : null;

    const newChildren = /** @type {Element['children']} */ (
        newFirst ? [newFirst, ...p.children.slice(1)] : p.children.slice(1)
    );
    return { type: mapped, newChildren };
};

/**
 * Try to detect an alert type from typical properties/classes produced by other plugins.
 * Returns a mapped callout type or null.
 *
 * @param {Element['properties']} props
 * @returns {'info'|'success'|'warning'|'error'|null}
 */
const mapGhTypeFromProps = (props) => {
    const p = /** @type {any} */ (props) || {};
    const fromAttr = p['data-alert-type'] || p['data-callout-type'];
    const fromAttrUpper = fromAttr ? String(fromAttr).toUpperCase() : null;

    const fromClassUpper = (() => {
        if (!p.className) return null;
        const classes = Array.isArray(p.className)
            ? p.className
            : String(p.className).split(/\s+/);
        const lowered = classes.map((/** @type {string} */ c) =>
            String(c).toLowerCase()
        );
        const hasAlert =
            lowered.includes('alert') ||
            lowered.includes('markdown-alert') ||
            lowered.includes('github-alert');
        const found = /** @type {Array<Lowercase<keyof typeof typeMap>>} */ (
            ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'].map((k) =>
                k.toLowerCase()
            )
        ).find((k) => lowered.includes(k));
        return hasAlert && found ? String(found).toUpperCase() : null;
    })();

    const ghUpper = /** @type {keyof typeof typeMap | null} */ (
        fromAttrUpper || fromClassUpper
    );
    return ghUpper && typeMap[ghUpper] ? typeMap[ghUpper] : null;
};

/**
 * Find the index of the first paragraph child in a blockquote element, skipping leading
 * whitespace-only text nodes. Returns -1 if no suitable paragraph is found.
 *
 * @param {Element} el
 * @returns {number}
 */
const findFirstParagraphIndex = (el) => {
    if (!el || el.type !== 'element' || !Array.isArray(el.children)) return -1;
    let pIndex = -1;
    for (let i = 0; i < el.children.length; i++) {
        const c = /** @type {any} */ (el.children[i]);
        if (c?.type === 'element' && c.tagName === 'p') {
            pIndex = i;
            break;
        }
        if (
            c?.type === 'text' &&
            typeof c.value === 'string' &&
            c.value.trim() === ''
        ) {
            continue; // ignore leading whitespace text nodes
        }
        // If we encounter a non-whitespace non-paragraph element/text, stop searching
        if (pIndex === -1) break;
    }
    return pIndex;
};

/**
 * Visitor handler: transform a blockquote with a GitHub alert marker into a Callout element.
 * Mutates the parent by replacing the blockquote with the new Callout node using immutable array update.
 *
 * @param {import('unist').Node} blockquote
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 */
const transformBlockquoteNode = (blockquote, index, parent) => {
    const el = /** @type {Element} */ (blockquote);
    if (
        !el ||
        el.type !== 'element' ||
        el.tagName !== 'blockquote' ||
        !Array.isArray(el.children) ||
        el.children.length === 0 ||
        !parent ||
        typeof index !== 'number'
    ) {
        return;
    }

    const pIndex = findFirstParagraphIndex(el);
    if (pIndex === -1) return;

    const firstParagraph = /** @type {Element} */ (el.children[pIndex]);
    const extracted = extractAlertMarkerFromParagraph(firstParagraph);
    if (!extracted) return;

    const newParagraph = { ...firstParagraph, children: extracted.newChildren };
    const cleanedChildren = /** @type {Element['children']} */ (
        el.children.map((child, i) => (i === pIndex ? newParagraph : child))
    );

    const calloutNode = makeCallout(extracted.type, cleanedChildren);
    parent.children = replaceAt(parent.children, index, calloutNode);
};

/**
 * Visitor handler: wrap any element recognized as an alert (via class/props) into a Callout element.
 *
 * @param {import('unist').Node} node
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 */
const transformPropsBasedAlert = (node, index, parent) => {
    if (!parent || typeof index !== 'number') return;
    const element = /** @type {Element} */ (node);
    if (!element || element.type !== 'element' || !element.properties) return;
    const mapped = mapGhTypeFromProps(element.properties);
    if (!mapped) return;

    const wrapped = makeCallout(mapped, element.children || []);
    parent.children = replaceAt(parent.children, index, wrapped);
};

/**
 * Rehype plugin factory (functional style).
 *
 * Transforms either:
 * 1) Blockquotes whose first paragraph starts with a GitHub alert marker, or
 * 2) Elements produced by other alert plugins (detected by attributes/classes),
 * into <Components.Callout type="..."> nodes.
 *
 * @returns {(tree: Root) => void}
 */
const rehypeGithubCallouts = () => (tree) => {
    // 1) Direct GitHub-style marker inside blockquote
    visit(
        tree,
        (node) =>
            node.type === 'element' &&
            /** @type {Element} */ (node).tagName === 'blockquote',
        transformBlockquoteNode
    );

    // 2) Wrap elements produced by other plugins
    visit(
        tree,
        (node) =>
            node.type === 'element' && /** @type {Element} */ (node).properties,
        transformPropsBasedAlert
    );
};

export default rehypeGithubCallouts;
