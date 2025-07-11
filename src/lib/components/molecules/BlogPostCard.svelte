<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Tag from '$lib/components/atoms/Tag.svelte';
    import Image from '../atoms/Image.svelte';
    import type { BlogPost } from '$utils/types';

    type Props = {
        post: BlogPost;
        showImage?: boolean;
    };

    let { post, showImage = true }: Props = $props();
</script>

<Card href="/{post.slug}" class="blog-post-card">
    {#snippet image()}
        {#if post.coverImage && showImage}
            <div class="cover-image">
                <Image
                    src={post.coverImage}
                    alt="Cover image of this blog post"
                />
            </div>
        {/if}
    {/snippet}
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
</style>
