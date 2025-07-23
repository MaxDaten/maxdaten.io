<script lang="ts">
    import OgCard from '../OgCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>OG Card Preview - {data.post.title}</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="og-preview-container">
    <div class="og-preview-header">
        <h1>OG Card Preview</h1>
        <p>
            Preview of the Open Graph card for: <strong
                >{data.post.title}</strong
            >
        </p>
        <p class="og-url">
            Actual OG image URL: <code>/[slug]/og.png</code>
        </p>
    </div>

    <div class="og-preview-card">
        <OgCard post={data.post} coverImageSrc={data.coverImageSrc} />
    </div>

    <div class="og-preview-info">
        <h2>Card Information</h2>
        <dl>
            <dt>Title:</dt>
            <dd>{data.post.title}</dd>

            {#if data.post.excerpt}
                <dt>Excerpt:</dt>
                <dd>{data.post.excerpt}</dd>
            {/if}

            {#if data.post.tags?.length}
                <dt>Tags:</dt>
                <dd>{data.post.tags.join(', ')}</dd>
            {/if}

            {#if data.post.readingTimeMinutes}
                <dt>Reading Time:</dt>
                <dd>{data.post.readingTimeMinutes} minutes</dd>
            {/if}

            <dt>Has Cover Image:</dt>
            <dd>
                {data.coverImageSrc ? `Yes ('${data.coverImageSrc}')` : 'No'}
            </dd>
        </dl>
    </div>

    <div class="og-preview-info">
        <h2>Post Data</h2>
        <pre class="post-json"><code>{JSON.stringify(data.post, null, 2)}</code
            ></pre>
    </div>
</div>

<style>
    .og-preview-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
    }

    .og-preview-header {
        margin-bottom: 2rem;
        text-align: center;
    }

    .og-preview-header h1 {
        color: #e6e5e5;
        margin-bottom: 0.5rem;
    }

    .og-preview-header p {
        color: #666;
        margin-bottom: 0.5rem;
    }

    .og-url {
        font-size: 0.9rem;
    }

    .og-url code {
        background: #f5f5f5;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .og-preview-card {
        width: 1200px;
        height: 630px;
    }

    .og-preview-info {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 8px;
    }

    .og-preview-info h2 {
        margin-top: 0;
        color: #1a1a1a;
    }

    .og-preview-info dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem 1rem;
        margin: 0;
    }

    .og-preview-info dt {
        font-weight: 600;
        color: #333;
    }

    .og-preview-info dd {
        margin: 0;
        color: #666;
    }

    .post-json {
        color: #666;
        font-size: 0.7rem;
        overflow: scroll;
    }

    @media (max-width: 1280px) {
        .og-preview-card {
            width: 100%;
            height: auto;
            aspect-ratio: 1200 / 630;
        }
    }
</style>
