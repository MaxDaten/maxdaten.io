/**
 * Configuration:
 * - sectionTitle: Title of the references section (default: 'References')
 * - internalDomains: List of domains to treat as internal (not external)
 * - minCountToShow: Minimum number of references to show section (default: 1)
 * - ignoreSelectors: CSS selectors for elements to ignore (default: ['code', 'pre', 'nav', etc])
 * - maxExampleTextsPerUrl: Max number of example texts to collect per URL (default: 3)
 * - maxExampleTextLength: Max length of collected example texts (default: 140)
 * - normalizeUrls: Whether to normalize URLs for deduplication (default: true)
 * - stripQueryParams: Function to determine which query params to strip (default: utm_*, etc)
 */
import { CONTINUE, SKIP, visit } from 'unist-util-visit';

/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').Text} HastText
 * @typedef {import('hast').Parent} HastParent
 * @typedef {import('vfile').VFile} VFile
 */

const DEFAULT_IGNORES = [
    'code',
    'pre',
    'nav',
    'aside',
    'figure',
    'figcaption',
    'footer',
];

/**
 * @typedef {{
 *	 noReferences?: boolean;
 *	 referencesTitle?: string;
 *	 referencesMinCount?: number;
 *	 internalDomains?: string[];
 * }} Frontmatter
 */

/**
 * @typedef {{
 *	 sectionTitle?: string;
 *	 internalDomains?: string[];
 *	 minCountToShow?: number;
 *	 ignoreSelectors?: string[];
 *	 maxExampleTextsPerUrl?: number;
 *	 maxExampleTextLength?: number;
 *	 normalizeUrls?: boolean;
 *	 stripQueryParams?: (param: string) => boolean;
 * }} CollectExternalLinksOptions
 */

/**
 * @typedef {{ url: string; normUrl: string; domain: string; count: number; texts: string[] }} ReferenceEntry
 */

// ──────────────────────────────────────────────────────────────────────────────
// Pure utilities
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Determine whether an href is external (http/https and not one of the internalDomains).
 * @param {string} href
 * @param {string[]} internalDomains
 * @returns {boolean}
 */
function isExternalHref(href, internalDomains) {
    if (!href || typeof href !== 'string') return false;
    if (!/^https?:\/\//i.test(href)) return false;
    try {
        const u = new URL(href);
        const host = (u.hostname || '').toLowerCase();
        const matches = /** @param {string} d */ (d) => {
            const dl = d.toLowerCase();
            return host === dl || host.endsWith('.' + dl);
        };
        return !internalDomains.some(matches);
    } catch {
        return false;
    }
}

/**
 * Default predicate to strip common tracking query parameters during URL normalization.
 * @param {string} param
 * @returns {boolean}
 */
function defaultStripQueryParams(param) {
    const p = param.toLowerCase();
    return (
        p.startsWith('utm_') ||
        p === 'fbclid' ||
        p === 'gclid' ||
        p === 'mc_cid' ||
        p === 'mc_eid' ||
        p === 'ref' ||
        p === 'ref_src'
    );
}

/**
 * Normalize a URL for deduplication: drop hash, remove tracking query params, trim trailing slash.
 * @param {string} href
 * @param {(param: string) => boolean} stripQueryParams
 * @returns {string}
 */
function normalizeUrl(href, stripQueryParams) {
    try {
        const u = new URL(href);
        u.hash = '';
        if (u.searchParams && stripQueryParams) {
            const toDelete = [];
            for (const [k] of u.searchParams.entries()) {
                if (stripQueryParams(k)) toDelete.push(k);
            }
            toDelete.forEach((k) => u.searchParams.delete(k));
        }
        if (u.pathname !== '/' && u.pathname.endsWith('/')) {
            u.pathname = u.pathname.replace(/\/+$/, '');
        }
        return u.toString();
    } catch {
        return href;
    }
}

/**
 * Extract visible text from a HAST node (anchors and their children), collapsing whitespace.
 * @param {HastElement|HastText|any} node
 * @param {number} [maxLen]
 * @returns {string}
 */
function toText(node, maxLen) {
    if (!node) return '';
    const gather = /** @param {any} n */ (n) => {
        if (n.type === 'text') return n.value || '';
        if (Array.isArray(n.children)) return n.children.map(gather).join('');
        return '';
    };
    const raw = gather(node).replace(/\s+/g, ' ').trim();
    if (maxLen && raw.length > maxLen) return raw.slice(0, maxLen - 1) + '…';
    return raw;
}

/**
 * Merge global options and frontmatter overrides into a single effective config.
 * Pure function.
 * @param {CollectExternalLinksOptions} base
 * @param {Frontmatter} fm
 */
function makeEffectiveOptions(base, fm) {
    return {
        sectionTitle: fm.referencesTitle ?? base.sectionTitle ?? 'References',
        internalDomains: fm.internalDomains ?? base.internalDomains ?? [],
        minCountToShow: fm.referencesMinCount ?? base.minCountToShow ?? 1,
        ignoreSelectors: base.ignoreSelectors ?? DEFAULT_IGNORES,
        maxExampleTextsPerUrl: base.maxExampleTextsPerUrl ?? 3,
        maxExampleTextLength: base.maxExampleTextLength ?? 140,
        normalizeUrls: base.normalizeUrls ?? true,
        stripQueryParams: base.stripQueryParams ?? defaultStripQueryParams,
    };
}

/**
 * Classify and normalize href as an external URL or return null if not external.
 * Pure function.
 * @param {string|unknown} href
 * @param {{ internalDomains: string[], normalizeUrls: boolean, stripQueryParams: (param: string) => boolean }} cfg
 * @returns {{ normUrl: string, domain: string } | null}
 */
function classifyHref(href, cfg) {
    if (typeof href !== 'string') return null;
    if (!isExternalHref(href, cfg.internalDomains)) return null;
    const normUrl = cfg.normalizeUrls
        ? normalizeUrl(href, cfg.stripQueryParams)
        : href;
    try {
        const domain = new URL(normUrl).hostname || '';
        return { normUrl, domain };
    } catch {
        return { normUrl, domain: '' };
    }
}

/**
 * Pure-ish collector: walks the tree and returns a list of ReferenceEntry (no tree mutation).
 * Side-effects are limited to building a local Map and array.
 * @param {HastRoot} tree
 * @param {{
 *   ignoreSelectors: string[],
 *   maxExampleTextsPerUrl: number,
 *   maxExampleTextLength: number,
 *   internalDomains: string[],
 *   normalizeUrls: boolean,
 *   stripQueryParams: (param: string) => boolean,
 * }} cfg
 * @returns {ReferenceEntry[]}
 */
function collectEntries(tree, cfg) {
    /** @type {Map<string, ReferenceEntry>} */
    const byUrl = new Map();
    const ignoreSet = new Set(cfg.ignoreSelectors.map((t) => t.toLowerCase()));

    visit(
        tree,
        'element',
        /** @type {(node: HastElement, index: number|null, parent: HastParent|null) => any} */ (
            node
        ) => {
            const tag = node.tagName?.toLowerCase?.();

            // Skip whole subtrees for ignored containers (functional-friendly, no ancestry state)
            if (ignoreSet.has(tag)) return SKIP;

            if (tag === 'a') {
                // Skip autolink heading badges
                const className = /** @type {any} */ (
                    node.properties?.className
                );
                if (
                    Array.isArray(className) &&
                    className.some((c) => String(c).includes('heading-link'))
                ) {
                    return CONTINUE;
                }

                const res = classifyHref(node.properties?.href, cfg);
                if (!res) return CONTINUE;

                let entry = byUrl.get(res.normUrl);
                if (!entry) {
                    entry = {
                        url: /** @type {string} */ (node.properties?.href),
                        normUrl: res.normUrl,
                        domain: res.domain,
                        count: 0,
                        texts: [],
                    };
                    byUrl.set(res.normUrl, entry);
                }

                entry.count += 1;

                const text = toText(node, cfg.maxExampleTextLength);
                if (
                    text &&
                    !entry.texts.includes(text) &&
                    entry.texts.length < cfg.maxExampleTextsPerUrl
                ) {
                    entry.texts.push(text);
                }
            }

            return CONTINUE;
        }
    );

    return [...byUrl.values()];
}

/**
 * Pure renderer: build the References section HAST subtree.
 * @param {ReferenceEntry[]} entries
 * @param {{ sectionTitle: string }} cfg
 * @returns {HastElement}
 */
function renderSection(entries, cfg) {
    /** @type {HastElement} */
    const heading = {
        type: 'element',
        tagName: 'h2',
        properties: { id: 'references' },
        children: [{ type: 'text', value: cfg.sectionTitle }],
    };

    const linkItem = /** @param {ReferenceEntry} e */ (e) => ({
        type: 'element',
        tagName: 'li',
        properties: {},
        children: [
            {
                type: 'element',
                tagName: 'a',
                properties: {
                    href: e.normUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                children: [{ type: 'text', value: e.normUrl }],
            },
        ],
    });

    /** @type {any[]} */
    const contentNodes = [];
    contentNodes.push({
        type: 'element',
        tagName: 'ul',
        properties: {},
        children: entries.map(linkItem),
    });

    return {
        type: 'element',
        tagName: 'section',
        properties: { className: ['post-references'] },
        children: [heading, ...contentNodes],
    };
}

/**
 * Small helper: check if the tree already contains our section (idempotent append).
 * @param {HastRoot} tree
 */
function hasReferencesSection(tree) {
    return tree.children?.some(
        (n) =>
            n.type === 'element' &&
            n.tagName === 'section' &&
            Array.isArray(/** @type {any} */ (n.properties)?.className) &&
            /** @type {any} */ (n.properties).className.includes(
                'post-references'
            )
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Exported plugin (thin orchestration layer)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Create a rehype transformer that collects external links and appends a References section.
 * @param {CollectExternalLinksOptions} [options]
 * @returns {(tree: HastRoot, file: VFile) => void}
 */
export default function rehypeCollectExternalLinks(options = {}) {
    /** @type {(tree: HastRoot, file: VFile) => void} */
    return (tree, file) => {
        const fm = /** @type {Frontmatter} */ (file?.data?.fm || {});
        if (fm.noReferences) return;

        // Merge config functionally
        const cfg = makeEffectiveOptions(options, fm);

        // Collect entries purely; then filter and sort for rendering
        let entries = collectEntries(tree, cfg);
        entries = entries.filter((e) => e.count >= cfg.minCountToShow);
        if (entries.length === 0) return;

        // Idempotency guard
        if (hasReferencesSection(tree)) return;

        // Stable deterministic order
        entries.sort(
            (a, b) =>
                a.domain.localeCompare(b.domain) ||
                a.normUrl.localeCompare(b.normUrl)
        );

        // Build and append the references section (localized side effect)
        const section = renderSection(entries, {
            sectionTitle: cfg.sectionTitle,
        });
        tree.children.push(section);
    };
}
