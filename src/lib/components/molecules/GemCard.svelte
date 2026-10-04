<script lang="ts">
    import Card from '#lib/components/atoms/Card.svelte';
    import Tag from '#lib/components/atoms/Tag.svelte';
    import { urlFor, generateSrcSet } from '#lib/sanity/image.js';
    import type { SanityImageSource } from '@sanity/image-url';

    interface SanityCoverImage {
        url?: string;
        alt?: string;
        lqip?: string;
        asset?: SanityImageSource;
    }

    interface Props {
        /** Anchor id, so internal links to a gem (/gems#slug) land on its card. */
        id?: string;
        title: string;
        coverImage: string | SanityCoverImage;
        excerpt: string;
        href: string;
        tags: string[] | undefined;
        showImage?: boolean;
        /** The cover's rendered width, as an img `sizes` value; depends on the grid slot. */
        sizes?: string;
    }

    let {
        id,
        title,
        coverImage,
        excerpt,
        href,
        tags,
        sizes = '(max-width: 900px) calc(100vw - 2rem), 360px',
    }: Props = $props();

    const COVER_WIDTHS = [320, 400, 480, 640, 800, 1000, 1280, 1600, 2000];

    // Legacy string paths have no Sanity asset to transform
    let cover = $derived(
        typeof coverImage !== 'string' && coverImage?.asset
            ? coverImage
            : undefined
    );
</script>

<Card {id} {href} target="_self" class="gem-card" data-testid="gem-card">
    {#snippet image()}
        {#if cover}
            <div class="cover-image-container">
                <!-- Decorative inside the card link: the title names it; alt text would only pad the link name. -->
                <img
                    class="cover-image"
                    src={urlFor(cover).width(640).auto('format').url()}
                    srcset={generateSrcSet(cover, COVER_WIDTHS)}
                    {sizes}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style:background-image={cover.lqip
                        ? `url(${cover.lqip})`
                        : undefined}
                    style:background-size="cover"
                />
            </div>
        {/if}
    {/snippet}
    {#snippet content()}
        <div class="content">
            <h2 class="title">
                {title}
            </h2>
            {#if excerpt}
                <p class="text">
                    {excerpt}
                </p>
            {/if}
        </div>
    {/snippet}
    {#snippet footer()}
        {#if tags?.length}
            <div class="tags">
                {#each tags.slice(0, 2) as tag, index (index)}
                    <Tag color={index === 0 ? 'primary' : 'secondary'}
                        >{tag}</Tag
                    >
                {/each}
            </div>
        {/if}
    {/snippet}
</Card>

<style>
    :global(.gem-card) {
        .content {
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: flex-start;
        }

        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            font-size: var(--text-heading-4);
            font-family: var(--font--title), serif;
            font-weight: 700;
            line-height: var(--text-body-leading);
            margin: 0;
        }

        .tags {
            display: flex;
            align-items: center;
            gap: var(--space-hairline);
            flex-wrap: wrap;
        }

        .text {
            margin: var(--space-hairline) 0 0 0;
            font-size: var(--text-ui);
            text-align: justify;
        }

        .cover-image-container {
            width: 100%;
            height: 100%;
        }

        :global(.cover-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
</style>
