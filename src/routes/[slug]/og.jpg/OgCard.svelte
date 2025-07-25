<svelte:options css="injected" />

<script lang="ts">
    import type { BlogPost } from '$utils/types';

    type Props = {
        post: BlogPost;
        coverImageSrc?: string;
    };

    let { post, coverImageSrc }: Props = $props();
</script>

<div class="og-card">
    {#if coverImageSrc}
        <div class="cover-image-container">
            <img src={coverImageSrc} alt="" class="cover-image" />
            {#if post.readingTimeMinutes}
                <div class="reading-time-overlay">
                    <span class="reading-time-text"
                        >{post.readingTimeMinutes} min read</span
                    >
                </div>
            {/if}
        </div>
    {/if}

    <div class="content">
        <h1 class="title">{post.title}</h1>
        {#if post.excerpt}
            <p class="excerpt">{post.excerpt}</p>
        {/if}

        <div class="footer">
            <div class="tags">
                {#if post.tags?.length}
                    {#each post.tags.slice(0, 3) as tag, i (i)}
                        <span class="tag">{tag}</span>
                    {/each}
                {/if}
            </div>

            <div class="branding">
                <span class="site-name">maxdaten.io</span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    /* Note: Only Satori-compatible CSS (mainly flexbox) */
    /* No CSS variable support */
    @use '$lib/scss/_themes.scss' as *;

    $font-default: 'Inter', sans-serif;
    $font-title: 'Merriweather', serif;
    $font-logo: 'Baloo-2', sans-serif;

    .og-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: $color-page-background;

        border: 8px solid $color-secondary-tint;

        font-family: $font-default;
    }

    .cover-image-container {
        display: flex;
        position: relative;
        width: 100%;
        height: 40%;
        overflow: hidden;
    }

    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .reading-time-overlay {
        display: flex;
        position: absolute;
        bottom: 16px;
        right: 16px;
        background-color: rgba($color-page-background, 0.85);
        border-radius: 8px;
        padding: 8px 12px;
        border: 1px solid $color-primary;
    }

    .reading-time-text {
        font-size: 2.1rem;
        font-weight: 900;
        color: $color-primary;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 12px 24px;
        background-color: $color-page-background;
    }

    .title {
        font-size: 56px;
        font-weight: 700;
        line-height: 1.2;
        color: $color-text;
        font-family: $font-title;
    }

    .excerpt {
        font-size: 1.6rem;
        line-height: 1.5;
        color: $color-text-shade;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
        margin: -4px 0;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: auto;
    }

    .tags {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin: auto 0;
    }

    .tag {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background-color: rgba($color-text-inverse-shade, 0.5);
        border-radius: 10px;
        font-size: 1.8rem;
        letter-spacing: 0.08em;
        color: $color-text;
    }

    .branding {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .site-name {
        font-family: $font-logo;
        font-size: 3.5rem;
        font-weight: 800;
        color: $color-primary;
    }
</style>
