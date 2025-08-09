<script lang="ts">
    import Card from '$lib/components/atoms/Card.svelte';
    import Tag from '$components/atoms/Tag.svelte';
    import { FxReveal as Img } from '@zerodevx/svelte-img';

    interface Props {
        title: string;
        coverImage: string;
        excerpt: string;
        href: string;
        tags: string[] | undefined;
        showImage?: boolean;
    }

    let { title, coverImage, excerpt, href, tags }: Props = $props();

    const coverImages = Object.entries(
        import.meta.glob('$assets/images/gems/*.{jpg,jpeg,png,gif,webp}', {
            import: 'default',
            eager: true,
            query: { as: 'run:4', fit: 'cover' },
        })
    ).reduce((map: Map<string, unknown>, [key, value]) => {
        return map.set(key.split('/').pop() as string, value);
    }, new Map<string, unknown>());

    const coverImageSrc = coverImages.get(
        coverImage.split('/').pop() as string
    );
</script>

<Card {href} target="_self" class="gem-card" data-testid="gem-card">
    {#snippet image()}
        {#if coverImage && coverImageSrc}
            <div class="cover-image-container">
                <Img
                    {...{ class: 'cover-image' }}
                    src={coverImageSrc}
                    alt="Cover preview of this gem"
                    --reveal-transition="opacity 400ms ease-in, transform 0.8s ease-out;"
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

<style lang="scss">
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

        .cover-image-container {
            max-height: 350px;
            //background-color: black;
            object-fit: cover;
            overflow: hidden;
        }

        :global(.cover-image) {
            object-fit: cover;
            //height: 100%;
            width: 100%;
            max-height: 350px;
        }
    }
</style>
