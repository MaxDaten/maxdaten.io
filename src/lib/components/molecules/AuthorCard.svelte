<script lang="ts">
    import type { Author } from '$lib/utils/types';
    import Img from '@zerodevx/svelte-img';
    import { getAuthorAvatar } from '$lib/utils/image-loader';
    import Socials from '$components/molecules/Socials.svelte';
    import Button from '$components/atoms/Button.svelte';
    import CalendarIcon from '$lib/icons/calendar.svelte';

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
                    src={author.avatarUrl}
                    alt={author.avatarAlt ?? `${author.name}'s avatar`}
                    width="36"
                    height="36"
                />
            {:else if fileAvatar}
                <Img
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

<style lang="scss">
    @use '$styles/breakpoints';

    .author-callout {
        margin-top: var(--raw-space-32);
        padding: var(--raw-space-24);
        border-radius: var(--raw-radius-sm);
        background: rgba(var(--color-text-rgb), 0.03);
        border: 1px solid rgba(var(--color-text-rgb), var(--raw-opacity-light));

        @include breakpoints.for-phone-only {
            padding: var(--raw-space-16);
        }
    }

    .outro-text {
        font-size: var(--raw-text-sm);
        font-weight: 500;
        line-height: var(--raw-leading-normal);
        letter-spacing: -0.01em;
        color: var(--color-text-muted);
        margin: 0 0 var(--raw-space-16);
        padding-bottom: var(--raw-space-16);
        border-bottom: 1px solid
            rgba(var(--color-text-rgb), var(--raw-opacity-subtle));

        @include breakpoints.for-phone-only {
            font-size: var(--raw-text-xs);
            margin-bottom: var(--raw-space-12);
            padding-bottom: var(--raw-space-12);
        }
    }

    .author-card {
        display: flex;
        align-items: center;
        gap: var(--raw-space-16);

        @include breakpoints.for-phone-only {
            gap: var(--raw-space-12);
        }
    }

    .avatar-section {
        flex-shrink: 0;

        :global(.avatar) {
            width: 36px;
            height: 36px;
            border-radius: var(--raw-radius-sm);
            object-fit: cover;
            border: 1px solid
                rgba(var(--color-text-rgb), var(--raw-opacity-light));
        }

        @include breakpoints.for-phone-only {
            :global(.avatar) {
                width: 32px;
                height: 32px;
            }
        }
    }

    .avatar-placeholder {
        width: 36px;
        height: 36px;
        border-radius: var(--raw-radius-sm);
        background: rgba(var(--color-text-rgb), var(--raw-opacity-subtle));
        color: rgba(var(--color-text-rgb), var(--raw-opacity-medium));
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: var(--raw-text-sm);
        letter-spacing: -0.02em;

        @include breakpoints.for-phone-only {
            width: 32px;
            height: 32px;
            font-size: var(--raw-text-xs);
        }
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-4);
        min-width: 0;
    }

    .name {
        font-weight: 600;
        font-size: var(--raw-text-sm);
        letter-spacing: -0.02em;
        color: var(--color-text);
    }

    .bio {
        font-size: var(--raw-text-xs);
        font-weight: 400;
        line-height: var(--raw-leading-normal);
        color: rgba(var(--color-text-rgb), var(--raw-opacity-strong));
        margin: 0;
        max-width: 48ch;

        @include breakpoints.for-phone-only {
            font-size: var(--raw-text-xs);
        }
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--raw-space-12);
        margin-top: var(--raw-space-8);
        flex-wrap: wrap;

        @include breakpoints.for-phone-only {
            gap: var(--raw-space-8);
        }
    }

    .actions :global(.socials) {
        padding: 0;
        opacity: 0.6;
        transition: opacity 150ms cubic-bezier(0.25, 1, 0.5, 1);

        &:hover {
            opacity: 1;
        }
    }
</style>
