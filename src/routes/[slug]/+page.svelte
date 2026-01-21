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

            <h1>{title}</h1>

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
    @use '$styles/breakpoints';

    article {
        --main-column-width: 680px;
        position: relative;
        padding: var(--space-section) var(--raw-space-16) var(--space-page);
        display: flex;
        flex-direction: column;
        gap: var(--space-group);

        @include breakpoints.for-tablet-portrait-up {
            padding-left: var(--raw-space-24);
            padding-right: var(--raw-space-24);
        }

        @include breakpoints.for-tablet-landscape-up {
            padding-left: var(--raw-space-32);
            padding-right: var(--raw-space-32);
        }
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--raw-space-12);
        width: min(var(--main-column-width), 100%);
        margin: 0 auto;

        h1 {
            font-size: var(--text-heading-1);
            font-weight: var(--font-weight-semibold);
            line-height: var(--text-heading-leading);
            letter-spacing: -0.02em;
            margin: var(--raw-space-8) 0 var(--raw-space-16);
            text-wrap: balance;
        }
    }

    .date-header {
        font-family: var(--font--mono), monospace;
        font-size: var(--raw-text-xs);
        font-variant-numeric: tabular-nums;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
    }

    .updated-label {
        margin-left: var(--raw-space-8);

        &::before {
            content: '·';
            margin-right: var(--raw-space-8);
            color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));
        }
    }

    .meta-line {
        display: flex;
        align-items: center;
        gap: var(--raw-space-8);
        font-family: var(--font--mono), monospace;
        font-size: var(--raw-text-xs);
        font-variant-numeric: tabular-nums;
        color: var(--color-text-muted);

        @include breakpoints.for-phone-only {
            flex-direction: column;
            gap: var(--raw-space-4);
        }
    }

    .avatar-inline {
        width: 20px;
        height: 20px;
        border-radius: var(--radius-avatar);
        object-fit: cover;
        border: 1px solid rgba(var(--color-text-rgb), var(--raw-opacity-light));
    }

    .author {
        display: inline-flex;
        align-items: center;
        gap: var(--raw-space-8);
    }

    .author-name {
        color: var(--color-text);
        font-weight: var(--font-weight-medium);
    }

    .separator {
        color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));

        @include breakpoints.for-phone-only {
            display: none;
        }
    }

    .reading-time {
        color: var(--color-text-muted);
    }

    .cover-image-container {
        width: 1000px;
        margin: 0 auto;
        border-radius: var(--radius-card);
        overflow: hidden;
        aspect-ratio: 2 / 1;

        @media (max-width: 1060px) {
            transform: translateX(calc((1100px - 100vw) / -2));
            width: 1100px;
        }

        @media (max-width: 767px) {
            aspect-ratio: 16 / 9;
            width: 100%;
            transform: none;
            border-radius: var(--raw-radius-sm);
        }

        .sanity-cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
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

        :global(.code-block),
        :global(pre.shiki),
        :global(.wrap.reveal),
        :global(.callout) {
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
        gap: var(--raw-space-8);
        flex-wrap: wrap;
    }
</style>
