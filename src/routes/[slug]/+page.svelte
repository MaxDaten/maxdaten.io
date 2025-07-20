<script lang="ts">
    import Tag from '$components/atoms/Tag.svelte';
    import Author from '$components/molecules/Author.svelte';
    import dateformat from 'dateformat';
    import { siteBaseUrl, title } from '$lib/data/meta';
    import RelatedPosts from '$components/organisms/RelatedPosts.svelte';
    import { PageTransition } from 'ssgoi';
    import type { PageProps } from './$types';
    import { FxParallax as Img } from '@zerodevx/svelte-img';
    import { getCoverBySlug } from '$utils/image-loader';
    import { getAuthor } from '$lib/data/authors.js';

    let { data: post }: PageProps = $props();

    let metaKeywords = $derived(
        post ? [...(post.tags || []), ...(post.keywords || [])] : []
    );

    const author = getAuthor(post.authorId);
</script>

<svelte:head>
    <meta name="keywords" content={metaKeywords.join(', ')} />

    <meta name="description" content={post.excerpt} />
    <meta property="og:description" content={post.excerpt} />
    <meta name="twitter:description" content={post.excerpt} />
    <link rel="canonical" href="{siteBaseUrl}/{post.slug}" />

    <title>{post.title} - {title}</title>
    <meta property="og:title" content="{post.title} - {title}" />
    <meta name="twitter:title" content="{post.title} - {title}" />

    {#if post.coverImage}
        <meta property="og:image" content="{siteBaseUrl}/{post.coverImage}" />
        <meta name="twitter:image" content="{siteBaseUrl}/{post.coverImage}" />
        <meta name="twitter:card" content="summary_large_image" />
    {/if}
</svelte:head>

<PageTransition>
    {@const Post = post.content}
    <article>
        <div class="header">
            <h1>{post.title}</h1>
            <div class="note">
                <time datetime={post.date}
                    >{dateformat(post.date, 'UTC:mmm dd, yyyy')}</time
                >
                {#if post.updated}
                    <span>•</span>
                    <span>
                        Updated: <time datetime={post.updated}
                            >{dateformat(
                                post.updated,
                                'UTC:mmm dd, yyyy'
                            )}</time
                        >
                    </span>
                {/if}
            </div>

            {#if post.readingTimeMinutes}
                <div class="note">
                    {post.readingTimeMinutes} minutes to read
                </div>
            {/if}
            {#if author}
                <Author {author} />
            {/if}
            {#if post.tags?.length}
                <div class="tags">
                    {#each post.tags as tag (tag)}
                        <Tag>{tag}</Tag>
                    {/each}
                </div>
            {/if}
        </div>
        {#if post.coverImage}
            <Img
                class="cover-image"
                src={getCoverBySlug(post.slug)}
                data-hero-key={post.coverImage}
                alt={post.title}
            />
        {/if}
        <div class="content">
            <Post />
        </div>
    </article>

    {#if post.relatedPosts && post.relatedPosts.length > 0}
        <div class="container">
            <RelatedPosts posts={post.relatedPosts} />
        </div>
    {/if}
</PageTransition>

<style lang="scss">
    @use '$styles/mixins';
    @use '$styles/breakpoints';

    article {
        --main-column-width: 65ch;
        position: relative;
        padding: 40px 15px 80px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        @include breakpoints.for-iphone-se {
            padding-left: 0;
            padding-right: 0;
        }

        @include breakpoints.for-tablet-portrait-up {
            padding-right: 20px;
            padding-left: 20px;
        }

        @include breakpoints.for-tablet-landscape-up {
            padding-right: 30px;
            padding-left: 30px;
        }

        .header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 10px;
            width: min(var(--main-column-width), 100%);
            margin: 0 auto;

            .note {
                font-size: 90%;
                color: rgba(var(--color--secondary-rgb), 0.8);
                display: inline-flex;
                gap: 8px;
            }
        }

        :global(.cover-image) {
            max-height: 400px;
            width: 100%;
            max-width: breakpoints.$breakpoint-desktop-min;
            object-fit: cover;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;

            @include breakpoints.for-phone-only {
                max-height: 250px;
                width: 150%;
                translate: -15% 0;
            }
        }

        .content {
            display: grid;
            grid-template-columns:
                1fr
                min(var(--main-column-width), 100%)
                1fr;

            :global(> *) {
                grid-column: 2;
            }
        }

        .tags {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            flex-wrap: wrap;
        }
    }
</style>
