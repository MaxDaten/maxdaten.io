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

<div class="wrapper">
    <!-- Single ambient gradient spanning the whole canvas -->
    <div class="ambient-gradient"></div>

    <!-- Content Container -->
    <div class="container">
        <!-- Brand badge centered at top -->
        <div class="brand-bar">
            <div class="brand">maxdaten.io</div>
        </div>

        <!-- Centered text content -->
        <div class="og_textbox">
            {#if post.readingTimeMinutes}
                <div class="badge">{post.readingTimeMinutes} min read</div>
            {/if}
            <h1>{post.title}</h1>
            {#if post.excerpt}
                <p class="sub">{post.excerpt}</p>
            {/if}
            {#if post.tags?.length}
                <div class="tags">
                    {#each post.tags.slice(0, 3) as tag, i (i)}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Cover image as wide "window" frame at bottom -->
        {#if coverImageSrc}
            <div class="image-frame">
                <img src={coverImageSrc} alt="" class="wide-cover-image" />
            </div>
        {/if}
    </div>

    <!-- Fade overlay for smooth cover image exit at bottom edge -->
    <div class="image-fade"></div>
    <!-- CTA last in DOM so it paints on top of the fade (Satori has no z-index) -->
    <div class="cta-overlay">
        <div class="cta">Read More</div>
    </div>
</div>

<style>
    /* Satori-safe CSS: Flexbox only, no CSS variables */
    /* Font fallback: 'Inter Variable' for browser preview, 'Inter' for Satori OG generation */
    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        background-color: #0a0a0c;
        font-family: 'Inter Variable', 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
    }

    /* Single ambient gradient spanning full canvas */
    .ambient-gradient {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* prettier-ignore */
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(255, 128, 0, 0.25));
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 32px 60px 0 60px;
    }

    .brand-bar {
        display: flex;
        margin-bottom: 16px;
    }

    .brand {
        display: flex;
        padding: 10px 28px;
        border: 2px solid #ff8000;
        color: #ff8000;
        border-radius: 50px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.02em;
        background-color: rgba(255, 128, 0, 0.08);
    }

    .og_textbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        max-width: 900px;
        margin-bottom: 20px;
        z-index: 10;
    }

    .badge {
        display: flex;
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
        color: #a1a1aa;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 4px 12px;
        margin-bottom: 12px;
        background: transparent;
    }

    h1 {
        display: flex;
        font-family: 'Inter Variable', 'Inter', sans-serif;
        font-size: 44px;
        line-height: 1.15;
        color: white;
        margin: 0 0 12px 0;
        font-weight: 800;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .sub {
        display: flex;
        font-size: 18px;
        color: #d4d4d8;
        line-height: 1.4;
        max-width: 700px;
        margin: 0 0 16px 0;
    }

    .tags {
        display: flex;
        gap: 8px;
    }

    .tag {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid rgba(255, 128, 0, 0.5);
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 18px;
        color: #ffb366;
        background-color: rgba(255, 128, 0, 0.12);
    }

    /* Cover image as "window" frame at the bottom */
    .image-frame {
        display: flex;
        position: relative;
        width: 100%;
        flex: 1;
        background: #18191d;
        border-radius: 20px 20px 0 0;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-bottom: none;
        padding: 12px 12px 0 12px;
        box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.5);
        overflow: hidden;
    }

    .wide-cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        border-radius: 12px 12px 0 0;
    }

    /* Bottom fade overlay - mirrors ProfileOgCard's right-edge fade pattern */
    .image-fade {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 200px;
        background: linear-gradient(180deg, rgba(10, 10, 12, 0), #0a0a0c);
    }

    .cta-overlay {
        display: flex;
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        justify-content: center;
    }

    .cta {
        display: flex;
        padding: 24px 64px;
        background: linear-gradient(180deg, #ff9533 0%, #ff8000 100%);
        color: #0a0a0c;
        border-radius: 14px;
        font-family: 'Inter Variable', 'Inter', sans-serif;
        font-size: 34px;
        font-weight: 700;
        box-shadow:
            0 0 40px rgba(255, 128, 0, 0.6),
            0 0 80px rgba(255, 128, 0, 0.3),
            0 4px 12px rgba(255, 128, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
</style>
