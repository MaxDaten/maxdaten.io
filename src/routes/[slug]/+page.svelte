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
    import { PortableText } from '@portabletext/svelte';
    import { portableTextComponents } from '$lib/sanity/portable-text';
    import { urlFor, generateSrcSet } from '$lib/sanity/image';
    import type { SanityPost, BlogPost } from '$utils/types';

    let { data }: PageProps = $props();

    // Derived values based on source type
    const isSanity = $derived(data.source === 'sanity');
    const sanityPost = $derived(isSanity ? (data.post as SanityPost) : null);
    const markdownPost = $derived(!isSanity ? (data.post as BlogPost) : null);

    // Common derived values - normalize across both sources
    const title = $derived(sanityPost?.title ?? markdownPost?.title ?? '');
    const date = $derived(sanityPost?.date ?? markdownPost?.date ?? '');
    const updated = $derived(
        sanityPost?.lastModified ?? markdownPost?.updated ?? undefined
    );
    const tags = $derived(
        sanityPost?.tags?.map((t) => t.name) ?? markdownPost?.tags ?? []
    );

    // Author handling - Sanity has embedded author, markdown uses authorId lookup
    const author = $derived.by(() => {
        if (sanityPost?.author) {
            return {
                id: 'sanity-author',
                name: sanityPost.author.name,
                // Sanity author image URL could be used for avatar
            };
        }
        if (markdownPost?.authorId) {
            return getAuthor(markdownPost.authorId);
        }
        return undefined;
    });

    // Cover image - Sanity uses CDN, markdown uses local asset lookup
    const markdownCover = $derived(
        markdownPost ? getCoverBySlug(markdownPost.slug) : null
    );

    // Reading time - only available for markdown posts currently
    const readingTimeMinutes = $derived(markdownPost?.readingTimeMinutes);

    // Related posts - same-source only per CONTEXT.md, skip for Sanity in this phase
    const relatedPosts = $derived(markdownPost?.relatedPosts ?? []);
</script>

<PageTransition>
    <article>
        <div class="header">
            <h1>{title}</h1>

            <div class="metadata">
                {#if author}
                    <Author {author} />
                {/if}
                <div class="post-details">
                    <div class="note">
                        <time datetime={date}
                            >{dateformat(date, 'UTC:mmm dd, yyyy')}</time
                        >
                        {#if updated}
                            <span>-</span>
                            <span>
                                Updated: <time datetime={updated}
                                    >{dateformat(
                                        updated,
                                        'UTC:mmm dd, yyyy'
                                    )}</time
                                >
                            </span>
                        {/if}
                    </div>
                    {#if readingTimeMinutes}
                        <div class="note">
                            {readingTimeMinutes} minutes to read
                        </div>
                    {/if}
                </div>
            </div>

            {#if tags.length}
                <div class="tags">
                    {#each tags as tag (tag)}
                        <Tag>{tag}</Tag>
                    {/each}
                </div>
            {/if}
        </div>

        {#if isSanity && sanityPost?.coverImage?.url}
            <div class="cover-image-container">
                <img
                    class="cover-image sanity-cover"
                    src={urlFor(sanityPost.coverImage)
                        .width(1280)
                        .auto('format')
                        .url()}
                    srcset={generateSrcSet(sanityPost.coverImage)}
                    sizes="(max-width: 1060px) 100vw, 1000px"
                    alt={sanityPost.coverImage.alt ?? title}
                    style:background-image={sanityPost.coverImage.lqip
                        ? `url(${sanityPost.coverImage.lqip})`
                        : undefined}
                    style:background-size="cover"
                />
            </div>
        {:else if markdownCover}
            <div class="cover-image-container">
                <Img
                    {...{
                        class: 'cover-image',
                        'data-hero-key': markdownCover.img.src,
                    }}
                    factor={0.5}
                    src={markdownCover}
                    alt={title}
                />
            </div>
        {/if}

        <div class="content">
            {#if isSanity && sanityPost}
                <PortableText
                    value={sanityPost.body}
                    components={portableTextComponents}
                />
            {:else if data.content}
                {@const Post = data.content}
                <Post />
            {/if}
        </div>
    </article>

    {#if relatedPosts.length > 0}
        <div class="container">
            <RelatedPosts posts={relatedPosts} />
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

            .sanity-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
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
