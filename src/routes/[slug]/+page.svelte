<script lang="ts">
    import Tag from '$components/atoms/Tag.svelte';
    import Author from '$components/molecules/Author.svelte';
    import AuthorCard from '$components/molecules/AuthorCard.svelte';
    import dateformat from 'dateformat';
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
                            {readingTimeMinutes} min read
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
                font-family: var(--font--mono), monospace;
                color: rgba(var(--color--secondary-rgb), 0.8);
                display: inline-flex;
                gap: 8px;

                @include breakpoints.for-phone-only {
                    gap: 4px;
                }
            }

            .note time {
                text-transform: uppercase;
                letter-spacing: 0.05em;
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
