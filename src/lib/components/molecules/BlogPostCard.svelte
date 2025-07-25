<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Tag from '$lib/components/atoms/Tag.svelte';
    import { FxReveal as Img } from '@zerodevx/svelte-img';
    import { getCoverBySlug } from '$lib/utils/image-loader';
    import type { BlogPost } from '$utils/types';

    type Props = {
        post: BlogPost;
        showImage?: boolean;
    };

    let { post, showImage = true }: Props = $props();
    const optimizedImage = getCoverBySlug(post.slug);
</script>

{#snippet image()}
    <Img
        src={optimizedImage}
        {...{ class: 'cover-image', 'data-hero-key': post.coverImage }}
        alt="Cover of this blog post"
        sizes="(max-width: 1024px) 500px, 1000px"
        --reveal-transition="opacity 400ms ease-in, transform 0.8s ease-out;"
    />
{/snippet}

<Card
    href="/{post.slug}"
    class="blog-post-card"
    image={showImage && optimizedImage ? image : undefined}
>
    {#snippet content()}
        <p class="title">
            {post.title}
        </p>
        {#if post.readingTimeMinutes}
            <div class="note">{post.readingTimeMinutes} min read</div>
        {/if}
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

        .note {
            font-size: 0.8rem;
            color: rgba(var(--color--secondary-rgb), 0.8);
        }

        .text {
            margin-top: 5px;
            font-size: 0.9rem;
            text-align: justify;
        }

        :global(.cover-image) {
            max-height: 350px;
            object-fit: cover;
        }
    }
</style>
