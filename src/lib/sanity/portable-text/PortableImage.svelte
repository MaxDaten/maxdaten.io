<script lang="ts">
    import type { CustomBlockComponentProps } from '@portabletext/svelte';
    import { urlFor, generateSrcSet } from '$lib/sanity/image';

    interface ImageValue {
        image: {
            asset: { _ref: string };
            hotspot?: { x: number; y: number };
            crop?: { top: number; bottom: number; left: number; right: number };
        };
        alt: string;
        caption?: string;
    }

    interface Props {
        portableText: CustomBlockComponentProps<ImageValue>;
        lqip?: string;
    }

    let { portableText, lqip }: Props = $props();
    let value = $derived(portableText.value);

    // Generate responsive srcset and default src
    let srcset = $derived(generateSrcSet(value.image));
    let src = $derived(urlFor(value.image).width(1280).auto('format').url());

    // Style object for LQIP placeholder
    let placeholderStyle = $derived(
        lqip
            ? `background-image: url(${lqip}); background-size: cover;`
            : undefined
    );
</script>

<figure class="portable-image">
    <img
        {src}
        {srcset}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 1280px"
        alt={value.alt}
        loading="lazy"
        style={placeholderStyle}
    />
    {#if value.caption}
        <figcaption>{value.caption}</figcaption>
    {/if}
</figure>

<style lang="scss">
    .portable-image {
        margin: 2rem 0;

        img {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: var(--image-shadow);
        }

        figcaption {
            font-size: 0.85rem;
            text-align: center;
            margin-top: 0.5rem;
            color: rgba(var(--color--text-rgb), 0.8);
        }
    }
</style>
