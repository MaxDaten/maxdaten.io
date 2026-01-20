<script lang="ts">
    import Tag from '$components/atoms/Tag.svelte';
    import AuthorCard from '$components/molecules/AuthorCard.svelte';
    import { formatPostDate, formatDateISO } from '$lib/utils/format-date';
    import { PageTransition } from 'ssgoi';
    import type { PageProps } from './$types';
    import { PortableText } from '@portabletext/svelte';
    import { portableTextComponents } from '$lib/sanity/portable-text';
    import { urlFor, generateSrcSet } from '$lib/sanity/image';
    import { calculateReadingTime } from '$lib/sanity/reading-time';

    let { data }: PageProps = $props();

    // Sanity post data
    const post = $derived(data.post);

    // Derived values from Sanity post
    const title = $derived(post.title);
    const date = $derived(post.date);
    const updated = $derived(post.lastModified ?? undefined);
    const tags = $derived(post.tags?.map((t) => t.name) ?? []);
    const readingTimeMinutes = $derived(calculateReadingTime(post.body));

    // Author handling - Sanity has embedded author with avatar and social links
    const author = $derived.by(() => {
        if (post.author) {
            return {
                id: 'sanity-author',
                name: post.author.name,
                tagline: post.author.tagline,
                bio: post.author.bio,
                avatarUrl: post.author.avatarUrl,
                avatarAlt: post.author.avatarAlt,
                calendarBookingUrl: post.author.calendarBookingUrl,
                socials: post.author.socialLinks
                    ? {
                          github: post.author.socialLinks.github,
                          linkedin: post.author.socialLinks.linkedin,
                          twitter: post.author.socialLinks.twitter,
                          email: post.author.email
                              ? `mailto:${post.author.email}`
                              : undefined,
                      }
                    : undefined,
            };
        }
        return undefined;
    });
</script>

<PageTransition>
    <article>
        <div class="header">
            <!-- Date FIRST (above title) -->
            <div class="date-header">
                <time datetime={formatDateISO(date)}
                    >{formatPostDate(date)}</time
                >
                {#if updated}
                    <span class="updated-label">
                        Updated: <time datetime={formatDateISO(updated)}
                            >{formatPostDate(updated)}</time
                        >
                    </span>
                {/if}
            </div>

            <h1>{title}</h1>

            <div class="meta-line">
                {#if author}
                    <span class="author">
                        {#if author.avatarUrl}
                            <img
                                class="avatar-inline"
                                src={author.avatarUrl}
                                alt=""
                                width="18"
                                height="18"
                            />
                        {/if}
                        <span class="author-name">{author.name}</span>
                    </span>
                    <span class="separator">•</span>
                {/if}
                {#if readingTimeMinutes}
                    <span class="reading-time"
                        >{readingTimeMinutes} min read</span
                    >
                {/if}
            </div>

            {#if tags.length}
                <div class="tags">
                    {#each tags as tag (tag)}
                        <Tag>{tag}</Tag>
                    {/each}
                </div>
            {/if}
        </div>

        {#if post.coverImage?.url}
            <div class="cover-image-container">
                <img
                    class="cover-image sanity-cover"
                    src={urlFor(post.coverImage)
                        .width(1280)
                        .auto('format')
                        .url()}
                    srcset={generateSrcSet(post.coverImage)}
                    sizes="(max-width: 1060px) 100vw, 1000px"
                    alt={post.coverImage.alt ?? title}
                    style:background-image={post.coverImage.lqip
                        ? `url(${post.coverImage.lqip})`
                        : undefined}
                    style:background-size="cover"
                />
            </div>
        {/if}

        <div class="content">
            <PortableText
                value={post.body}
                components={portableTextComponents}
            />

            {#if author}
                <AuthorCard {author} outroText={post.outroText} />
            {/if}
        </div>
    </article>
</PageTransition>

<style lang="scss">
    @use '$styles/mixins';
    @use '$styles/breakpoints';

    article {
        --main-column-width: 680px;
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

            .date-header {
                font-family: var(--font--mono), monospace;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: rgba(var(--color--secondary-rgb), 0.6);
                margin-bottom: 16px;
            }

            .updated-label {
                margin-left: 12px;

                &::before {
                    content: '·';
                    margin-right: 12px;
                    color: rgba(var(--color--secondary-rgb), 0.4);
                }
            }

            .meta-line {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: var(--font--mono), monospace;
                font-size: 13px;
                color: rgba(var(--color--secondary-rgb), 0.7);

                @include breakpoints.for-phone-only {
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
            }

            .avatar-inline {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                object-fit: cover;
                vertical-align: middle;
            }

            .author {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .author-name {
                color: var(--color--primary);
                font-weight: 500;
            }

            .separator {
                color: rgba(var(--color--secondary-rgb), 0.4);

                @include breakpoints.for-phone-only {
                    display: none;
                }
            }
        }

        .cover-image-container {
            width: 1000px;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            aspect-ratio: 2 / 1; /* Desktop: ultra-wide per CONTEXT.md */

            @media (max-width: 1060px) {
                transform: translateX(calc((1100px - 100vw) / -2));
                width: 1100px;
            }

            @media (max-width: 767px) {
                aspect-ratio: 16 / 9; /* Mobile: taller for better proportion */
                width: 100%;
                transform: none;
            }

            .sanity-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center; /* Center crop per CONTEXT.md */
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

            // Breakout elements - wider than prose column
            :global(.code-block),
            :global(pre.shiki),
            :global(.wrap.reveal) {
                grid-column: 1 / -1;
                max-width: 800px;
                width: 100%;
                margin-left: auto;
                margin-right: auto;
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
