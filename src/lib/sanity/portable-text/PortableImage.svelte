<script lang="ts">
    import type { CustomBlockComponentProps } from '@portabletext/svelte';
    import { urlFor, generateSrcSet } from '#lib/sanity/image.js';

    interface ImageValue {
        image: {
            asset: { _ref: string };
            hotspot?: { x: number; y: number };
            crop?: { top: number; bottom: number; left: number; right: number };
        };
        alt: string;
        caption?: string;
        /** Projected by the post query from the asset's metadata. */
        dimensions?: { width: number; height: number };
        lqip?: string | null;
    }

    interface Props {
        portableText: CustomBlockComponentProps<ImageValue>;
    }

    let { portableText }: Props = $props();
    let value = $derived(portableText.value);

    // Generate responsive srcset and default src
    let srcset = $derived(generateSrcSet(value.image));
    let src = $derived(urlFor(value.image).width(1280).auto('format').url());

    // Intrinsic size of the rendered (cropped) image, so the browser reserves its box before it loads.
    let size = $derived.by(() => {
        if (!value.dimensions) return undefined;
        const { width, height } = value.dimensions;
        const crop = value.image.crop;
        return {
            width: Math.round(
                width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
            ),
            height: Math.round(
                height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
            ),
        };
    });
</script>

<figure class="portable-image">
    <img
        {src}
        {srcset}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 1280px"
        alt={value.alt}
        width={size?.width}
        height={size?.height}
        loading="lazy"
        decoding="async"
        style:background-image={value.lqip ? `url(${value.lqip})` : undefined}
        style:background-size={value.lqip ? 'cover' : undefined}
    />
    {#if value.caption}
        <figcaption>{value.caption}</figcaption>
    {/if}
</figure>

<style>
    .portable-image {
        margin: var(--space-group) 0;

        img {
            display: block;
            width: 100%;
            height: auto;
            border-radius: var(--radius-block);
        }

        figcaption {
            font-size: var(--text-small);
            text-align: center;
            margin-top: var(--space-inline);
            color: rgba(var(--color-text-rgb), 0.8);
        }
    }
</style>
