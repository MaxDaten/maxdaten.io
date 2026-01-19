<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Tag from '$lib/components/atoms/Tag.svelte';
    import type { ListingPost } from '$routes/blog/+page.server';
    import { urlFor, generateSrcSet } from '$lib/sanity/image';

    type Props = {
        post: ListingPost;
        showImage?: boolean;
    };

    let { post, showImage = true }: Props = $props();

    // Check if this post has a cover image
    const hasCoverImage = $derived(post.coverImage?.url);
</script>

{#snippet sanityImage()}
    {#if post.coverImage?.url}
        <img
            class="cover-image sanity-cover"
            src={urlFor(post.coverImage).width(500).auto('format').url()}
            srcset={generateSrcSet(post.coverImage, [320, 500, 1000])}
            sizes="(max-width: 1024px) 500px, 1000px"
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

<style lang="scss">
    :global(.blog-post-card) {
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            font-size: 1.2rem;
            font-family: var(--font--title), serif;
            font-weight: 700;
        }

        .tags {
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
        }

        .text {
            margin-top: 5px;
            font-size: 0.9rem;
            text-align: justify;
        }

        :global(.cover-image) {
            max-height: 350px;
            object-fit: cover;
            object-position: 50% 75%;
        }

        :global(.sanity-cover) {
            width: 100%;
            height: 100%;
        }
    }
</style>
