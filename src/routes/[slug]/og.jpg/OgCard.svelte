<svelte:options css="injected" />

<script lang="ts">
    /**
     * Simplified post type for OG card generation.
     * Only includes fields actually used in the OG image.
     */
    type OgCardPost = {
        title: string;
        slug: string;
        excerpt?: string;
        tags?: string[];
        readingTimeMinutes?: number;
    };

    type Props = {
        post: OgCardPost;
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
            <div class="branding">
                <span class="site-name">maxdaten.io</span>
            </div>
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
        </div>
    </div>
</div>

<style>
    /* Note: Only Satori-compatible CSS (mainly flexbox) */
    /* No CSS variable support - Satori requires static values */
    /* Colors inlined from themes-og.scss - dark theme values */

    .og-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: #1c1e26;
        border: 8px solid #2d1d10;
        font-family: 'Inter', sans-serif;
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
        background-color: rgba(28, 30, 38, 0.85);
        border-radius: 8px;
        padding: 8px 12px;
        border: 1px solid #ff8000;
    }

    .reading-time-text {
        font-size: 2.1rem;
        font-weight: 900;
        color: #ff8000;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 12px 24px;
        background-color: #1c1e26;
    }

    .title {
        font-size: 56px;
        font-weight: 700;
        line-height: 1.2;
        color: #fffcfc;
        font-family: 'Inter', sans-serif;
    }

    .excerpt {
        font-size: 1.6rem;
        line-height: 1.5;
        color: #d9f9fd;
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
        position: relative;
        min-height: 64px;
        padding-right: 220px; /* reserve space for branding */
    }

    .tags {
        display: flex;
        gap: 12px;
    }

    .tag {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background-color: rgba(93, 95, 101, 0.5);
        border-radius: 10px;
        font-size: 1.8rem;
        letter-spacing: 0.08em;
        color: #fffcfc;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
    }

    .branding {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        padding: 0 8px;
        background-color: rgba(28, 30, 38, 0.75);
        border-bottom: 2px solid #ff8000;
        border-radius: 0 0 8px 0;
    }

    .site-name {
        font-family: 'Baloo-2', sans-serif;
        font-size: 3.5rem;
        font-weight: 800;
        color: #ff8000;
    }
</style>
