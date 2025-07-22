<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>OG Images Preview - All Blog Posts</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="og-preview-container">
    <div class="og-preview-header">
        <h1>OG Images Preview</h1>
        <p>
            Preview of all Open Graph images for blog posts ({data.posts.length}
            posts)
        </p>
    </div>

    <div class="og-grid">
        {#each data.posts as post (post.slug)}
            <div class="og-card">
                <div class="og-image-container">
                    <a
                        href="/{post.slug}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="/{post.slug}/og.png"
                            alt="OG image for {post.title}"
                            loading="lazy"
                        />
                    </a>
                </div>
                <div class="og-card-info">
                    <h3>
                        <a
                            href="/{post.slug}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {post.title}
                        </a>
                    </h3>
                    <p class="og-card-meta">
                        <span class="date"
                            >{new Date(post.date).toLocaleDateString()}</span
                        >
                        {#if post.tags?.length}
                            <span class="tags">
                                {post.tags.slice(0, 3).join(', ')}
                                {#if post.tags.length > 3}...{/if}
                            </span>
                        {/if}
                    </p>
                    <div class="og-card-links">
                        <a
                            href="/{post.slug}/og.png"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="og-link"
                        >
                            View OG Image
                        </a>
                        <a
                            href="/{post.slug}/og.png/preview"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="preview-link"
                        >
                            Individual Preview
                        </a>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    {#if data.posts.length === 0}
        <div class="no-posts">
            <p>No blog posts found.</p>
        </div>
    {/if}
</div>

<style>
    .og-preview-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        font-family: var(--font--default), sans-serif;
    }
    .og-preview-header {
        margin-bottom: 3rem;
        text-align: center;
    }
    .og-preview-header h1 {
        color: var(--color--text);
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
    }
    .og-preview-header p {
        color: var(--color--text-shade);
        font-size: 1.1rem;
    }
    .og-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }
    .og-card {
        background: var(--color--card-background);
        border-radius: 12px;
        box-shadow: var(--card-shadow);
        overflow: hidden;
        transition:
            transform 0.2s var(--ease-3),
            box-shadow 0.2s var(--ease-3);
    }
    .og-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--card-shadow-hover);
    }
    .og-image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1200 / 630;
        overflow: hidden;
    }
    .og-image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s var(--ease-3);
    }
    .og-image-container:hover img {
        transform: scale(1.02);
    }
    .og-image-container a {
        display: block;
        width: 100%;
        height: 100%;
    }
    .og-card-info {
        padding: 1.5rem;
    }
    .og-card-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        line-height: 1.4;
    }
    .og-card-info h3 a {
        color: var(--color--text);
        text-decoration: none;
        transition: color 0.2s var(--ease-3);
    }
    .og-card-info h3 a:hover {
        color: var(--color--primary);
    }
    .og-card-meta {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        color: var(--color--text-shade);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .date {
        font-weight: 500;
    }
    .tags {
        font-style: italic;
    }
    .og-card-links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    .og-card-links a {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s var(--ease-3);
    }
    .og-link {
        background: var(--color--primary);
        color: var(--color--text-inverse);
    }
    .og-link:hover {
        background: var(--color--primary-shade);
    }
    .preview-link {
        background: var(--color--page-background);
        color: var(--color--text);
        border: 1px solid #ddd;
    }
    .preview-link:hover {
        background: var(--color--code-inline-background);
        border-color: #ccc;
    }
    .no-posts {
        text-align: center;
        padding: 3rem;
        color: var(--color--text-shade);
        font-size: 1.1rem;
    }
    @media (max-width: 768px) {
        .og-preview-container {
            padding: 1rem;
        }
        .og-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        .og-preview-header h1 {
            font-size: 2rem;
        }
        .og-card-links {
            flex-direction: column;
        }
        .og-card-links a {
            text-align: center;
        }
    }
</style>
