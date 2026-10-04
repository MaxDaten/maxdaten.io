<script lang="ts">
    import type { Author } from '#lib/utils/types.js';
    import { getAuthorAvatar } from '#lib/utils/image-loader.js';
    import { avatarUrl } from '#lib/sanity/image.js';
    import Socials from '#lib/components/molecules/Socials.svelte';
    import Button from '#lib/components/atoms/Button.svelte';
    import CalendarIcon from '#lib/icons/calendar.svelte';

    type Props = {
        author: Author;
        outroText?: string;
    };

    let { author, outroText }: Props = $props();
    const fileAvatar = $derived(
        author.avatarUrl ? null : getAuthorAvatar(author.id)
    );
    // Use explicit outroText, or fall back to author tagline
    const displayOutro = $derived(outroText ?? author.tagline);
</script>

<aside class="author-callout">
    {#if displayOutro}
        <p class="outro-text">{displayOutro}</p>
    {/if}

    <div class="author-card">
        <div class="avatar-section">
            {#if author.avatarUrl}
                <img
                    class="avatar"
                    src={avatarUrl(author.avatarUrl, 36)}
                    alt={author.avatarAlt ?? `${author.name}'s avatar`}
                    width="36"
                    height="36"
                />
            {:else if fileAvatar}
                <enhanced:img
                    class="avatar"
                    src={fileAvatar}
                    alt="{author.name}'s avatar"
                    sizes="36px"
                />
            {:else}
                <div
                    class="avatar-placeholder"
                    aria-label="{author.name}'s avatar"
                >
                    {author.name.charAt(0).toUpperCase()}
                </div>
            {/if}
        </div>

        <div class="info-section">
            <span class="name">{author.name}</span>
            {#if author.bio}
                <p class="bio">{author.bio}</p>
            {/if}
            <div class="actions">
                {#if author.socials}
                    <Socials {...author.socials} size="small" />
                {/if}
                {#if author.calendarBookingUrl}
                    <Button
                        size="small"
                        style="understated"
                        href={author.calendarBookingUrl}
                    >
                        {#snippet icon()}
                            <CalendarIcon />
                        {/snippet}
                        Book a Call
                    </Button>
                {/if}
            </div>
        </div>
    </div>
</aside>

<style>
    .author-callout {
        margin-top: var(--space-group);
        padding: var(--space-block);
        border-radius: var(--radius-block);
        background: rgba(var(--color-text-rgb), 0.03);
        border: 1px solid rgba(var(--color-text-rgb), var(--opacity-wash));

        @media (max-width: 767px) {
            padding: var(--space-stack);
        }
    }

    .outro-text {
        font-size: var(--text-small);
        font-weight: 500;
        line-height: var(--leading-ui);
        letter-spacing: -0.01em;
        color: var(--color-text-muted);
        margin: 0 0 var(--space-stack);
        padding-bottom: var(--space-stack);
        border-bottom: 1px solid
            rgba(var(--color-text-rgb), var(--opacity-tint));

        @media (max-width: 767px) {
            font-size: var(--text-caption);
            margin-bottom: var(--space-tight);
            padding-bottom: var(--space-tight);
        }
    }

    .author-card {
        display: flex;
        align-items: center;
        gap: var(--space-stack);

        @media (max-width: 767px) {
            gap: var(--space-tight);
        }
    }

    .avatar-section {
        flex-shrink: 0;

        :global(.avatar) {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-block);
            object-fit: cover;
            border: 1px solid rgba(var(--color-text-rgb), var(--opacity-wash));
        }

        @media (max-width: 767px) {
            :global(.avatar) {
                width: 32px;
                height: 32px;
            }
        }
    }

    .avatar-placeholder {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-block);
        background: rgba(var(--color-text-rgb), var(--opacity-tint));
        color: rgba(var(--color-text-rgb), var(--opacity-half));
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: var(--text-small);
        letter-spacing: -0.02em;

        @media (max-width: 767px) {
            width: 32px;
            height: 32px;
            font-size: var(--text-caption);
        }
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-hairline);
        min-width: 0;
    }

    .name {
        font-weight: 600;
        font-size: var(--text-small);
        letter-spacing: -0.02em;
        color: var(--color-text);
    }

    .bio {
        font-size: var(--text-caption);
        font-weight: 400;
        line-height: var(--leading-ui);
        color: rgba(var(--color-text-rgb), var(--opacity-text-muted));
        margin: 0;
        max-width: 48ch;

        @media (max-width: 767px) {
            font-size: var(--text-caption);
        }
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--space-tight);
        margin-top: var(--space-inline);
        flex-wrap: wrap;

        @media (max-width: 767px) {
            gap: var(--space-inline);
        }
    }

    .actions :global(.socials) {
        padding: 0;
        opacity: 0.6;
        transition: opacity 150ms cubic-bezier(0.25, 1, 0.5, 1);

        &:hover,
        &:focus-within {
            opacity: 1;
        }
    }
</style>
