<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Tag from '$components/atoms/Tag.svelte';

    interface SanityCoverImage {
        url?: string;
        alt?: string;
        lqip?: string;
    }

    interface Props {
        title: string;
        coverImage: string | SanityCoverImage;
        excerpt: string;
        href: string;
        tags: string[] | undefined;
        showImage?: boolean;
    }

    let { title, coverImage, excerpt, href, tags }: Props = $props();

    // Support both legacy string path and Sanity object with url
    const coverImageUrl =
        typeof coverImage === 'string'
            ? undefined // Legacy path - would need local image handling
            : coverImage?.url;

    const coverImageAlt =
        typeof coverImage === 'string'
            ? 'Cover preview of this gem'
            : coverImage?.alt || 'Cover preview of this gem';
</script>

<Card {href} target="_self" class="gem-card" data-testid="gem-card">
    {#snippet image()}
        {#if coverImageUrl}
            <div class="cover-image-container">
                <img
                    class="cover-image"
                    src={coverImageUrl}
                    alt={coverImageAlt}
                    loading="lazy"
                />
            </div>
        {/if}
    {/snippet}
    {#snippet content()}
        <div class="content">
            <p class="title">
                {title}
            </p>
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
            font-size: 1.2rem;
            font-family: var(--font--title), serif;
            font-weight: 700;
            margin: 0;
        }

        .tags {
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
        }

        .text {
            margin: 5px 0 0 0;
            font-size: 0.9rem;
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
