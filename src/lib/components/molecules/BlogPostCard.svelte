<script lang="ts">
    import Card from '#lib/components/atoms/Card.svelte';
    import Tag from '#lib/components/atoms/Tag.svelte';
    import type { ListingPost } from '#lib/sanity/listing.js';
    import { urlFor, generateSrcSet } from '#lib/sanity/image.js';

    type Props = {
        post: ListingPost;
        showImage?: boolean;
        /** The cover's rendered width, as an <img sizes> value; depends on the grid slot. */
        sizes?: string;
        /** The first cover on the page is the likely LCP element: fetch it first, lazy-load the rest. */
        priority?: boolean;
    };

    let {
        post,
        showImage = true,
        sizes = '(max-width: 900px) calc(100vw - 2rem), 500px',
        priority = false,
    }: Props = $props();

    const COVER_WIDTHS = [320, 400, 480, 640, 800, 1000, 1280, 1600, 2000];

    // Check if this post has a cover image
    const hasCoverImage = $derived(post.coverImage?.url);
</script>

{#snippet sanityImage()}
    {#if post.coverImage?.url}
        <img
            class="cover-image sanity-cover"
            src={urlFor(post.coverImage).width(500).auto('format').url()}
            srcset={generateSrcSet(post.coverImage, COVER_WIDTHS)}
            {sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            alt={post.coverImage.alt ?? 'Cover of this blog post'}
            style:background-image={post.coverImage.lqip
                ? `url(${post.coverImage.lqip})`
                : undefined}
            style:background-size="cover"
        />
    {/if}
{/snippet}

<Card
    href="/{post.slug}"
    class="blog-post-card"
    image={showImage && hasCoverImage ? sanityImage : undefined}
>
    {#snippet content()}
        <p class="title">
            {post.title}
        </p>
        {#if post.excerpt}
            <p class="text">
                {post.excerpt}
            </p>
        {/if}
    {/snippet}
    {#snippet footer()}
        {#if post.tags?.length}
            <div class="tags">
                {#each post.tags.slice(0, 2) as tag, index (index)}
                    <Tag>{tag}</Tag>
                {/each}
            </div>
        {/if}
    {/snippet}
</Card>

<style>
    :global(.blog-post-card) {
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            font-size: var(--text-heading-4);
            font-family: var(--font--title), serif;
            font-weight: 700;
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

        :global(.cover-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
</style>
