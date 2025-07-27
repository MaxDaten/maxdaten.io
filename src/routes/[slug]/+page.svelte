<script lang="ts">
    import Tag from '$components/atoms/Tag.svelte';
    import Author from '$components/molecules/Author.svelte';
    import dateformat from 'dateformat';
    import RelatedPosts from '$components/organisms/RelatedPosts.svelte';
    import { PageTransition } from 'ssgoi';
    import type { PageProps } from './$types';
    import { FxParallax as Img } from '@zerodevx/svelte-img';
    import { getCoverBySlug } from '$utils/image-loader';
    import { getAuthor } from '$lib/data/authors.js';

    let { data: post }: PageProps = $props();

    const author = post.authorId ? getAuthor(post.authorId) : undefined;
</script>

<PageTransition>
    {@const Post = post.content}
    <article>
        <div class="header">
            <h1>{post.title}</h1>

            <div class="metadata">
                {#if author}
                    <Author {author} />
                {/if}
                <div class="post-details">
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
                </div>
            </div>

            {#if post.tags?.length}
                <div class="tags">
                    {#each post.tags as tag (tag)}
                        <Tag>{tag}</Tag>
                    {/each}
                </div>
            {/if}
        </div>
        {#if post.coverImage}
            <div class="cover-image-container">
                <Img
                    {...{
                        class: 'cover-image',
                        'data-hero-key': post.coverImage,
                    }}
                    factor={0.5}
                    src={getCoverBySlug(post.slug)}
                    alt={post.title}
                />
            </div>
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

        h1 {
            margin-bottom: 0.8em;
        }

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
            font-size: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 10px;
            width: min(var(--main-column-width), 100%);
            margin: 0 auto 0.8em;

            .note {
                color: rgba(var(--color--secondary-rgb), 0.8);
                display: inline-flex;
                gap: 8px;

                @include breakpoints.for-phone-only {
                    gap: 4px;
                }
            }

            .metadata {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                width: min(var(--main-column-width), 100%);
                margin-bottom: 1em;

                .post-details {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                @include breakpoints.for-tablet-landscape-up {
                    flex-direction: row;
                    gap: 32px;
                }

                @include breakpoints.for-phone-only {
                    gap: 12px;
                }
            }
        }

        .cover-image-container {
            width: 1000px;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            height: 400px;

            @media (max-width: 1060px) {
                transform: translateX(calc((1100px - 100vw) / -2));
                width: 1100px;
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
            gap: 12px;
            flex-wrap: wrap;
        }
    }
</style>
