<script lang="ts">
    import ProfileOgCard from '../ProfileOgCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>Profile OG Card Preview - {data.author.name}</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="og-preview-container">
    <div class="og-preview-header">
        <h1>Profile OG Card Preview</h1>
        <p>
            Preview of the Open Graph card for the landing page profile: <strong
                >{data.author.name}</strong
            >
        </p>
        <p class="og-url">
            Actual OG image URL: <code>/og.jpg</code>
        </p>
    </div>

    <div class="og-preview-card">
        <ProfileOgCard badge="Available for 2026" avatarUrl={data.avatarUrl} />
    </div>

    <div class="og-preview-info">
        <h2>Profile Information</h2>
        <dl>
            <dt>Name:</dt>
            <dd>{data.author.name}</dd>

            <dt>Tagline:</dt>
            <dd>{data.author.tagline}</dd>

            <dt>Bio:</dt>
            <dd>{data.author.bio}</dd>

            <dt>Specialties:</dt>
            <dd>{data.author.specialties?.join(', ')}</dd>

            <dt>Has Profile Image:</dt>
            <dd>
                {data.avatarUrl ? `Yes ('${data.avatarUrl}')` : 'No'}
            </dd>
        </dl>
    </div>

    <div class="og-preview-info">
        <h2>Author Data</h2>
        <pre class="author-json"><code
                >{JSON.stringify(data.author, null, 2)}</code
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

    .author-json {
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
