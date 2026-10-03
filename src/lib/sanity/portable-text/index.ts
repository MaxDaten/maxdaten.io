/**
 * Portable Text component map for @portabletext/svelte.
 * Maps Sanity block types and marks to Svelte components.
 */
import type { PortableTextComponents } from '@portabletext/svelte';
import CodeBlock from './CodeBlock.svelte';
import Callout from './Callout.svelte';
import PortableImage from './PortableImage.svelte';
import InternalLink from './InternalLink.svelte';
import ExternalLink from './ExternalLink.svelte';
import Heading from './Heading.svelte';

/**
 * Component map for rendering Portable Text from Sanity.
 * Use with <PortableText components={portableTextComponents} ... />
 */
export const portableTextComponents: PortableTextComponents = {
    types: {
        codeBlock: CodeBlock,
        callout: Callout,
        portableImage: PortableImage,
    },
    marks: {
        internalLink: InternalLink,
        link: ExternalLink,
    },
    // A partial override: mergeComponents spreads it over the default block styles at runtime.
    // CustomStyles is typed as a full Record, which requires every style once the hoisted
    // @portabletext/types is v4 (an undeclared dependency of @portabletext/svelte 3).
    block: {
        h1: Heading,
        h2: Heading,
        h3: Heading,
        h4: Heading,
        h5: Heading,
        h6: Heading,
    } as PortableTextComponents['block'],
};

// Re-export individual components for direct use
export {
    CodeBlock,
    Callout,
    PortableImage,
    InternalLink,
    ExternalLink,
    Heading,
};
