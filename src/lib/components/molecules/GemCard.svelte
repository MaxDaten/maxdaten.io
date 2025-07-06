<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Image from '$components/atoms/Image.svelte';
    import Tag from '$components/atoms/Tag.svelte';

    interface Props {
        title: string;
        coverImage?: string | undefined;
        excerpt: string;
        href: string;
        tags: string[] | undefined;
        showImage?: boolean;
    }

    let {
        title,
        coverImage = undefined,
        excerpt,
        href,
        tags,
    }: Props = $props();
</script>

<Card {href} target="_self" class="gem-card" data-testid="gem-card">
    {#snippet image()}
        {#if coverImage}
            <div class="cover-image">
                <Image src={coverImage} alt="Cover image of this gem" />
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
        <div class="footer">
            {#if tags?.length}
                <div class="tags">
                    {#each tags.slice(0, 2) as tag, index (index)}
                        <Tag color={index === 0 ? 'primary' : 'secondary'}
                            >{tag}</Tag
                        >
                    {/each}
                </div>
            {/if}
        </div>
    {/snippet}
</Card>

<style lang="scss">
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
        font-family: var(--font--title);
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

    .footer {
        margin-top: 20px;
    }

    .cover-image {
        width: 100%;
    }
</style>
