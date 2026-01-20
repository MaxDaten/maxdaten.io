<script lang="ts">
    import type { Author } from '$lib/utils/types';
    import Img from '@zerodevx/svelte-img';
    import { getAuthorAvatar } from '$lib/utils/image-loader';
    import Socials from '$components/molecules/Socials.svelte';

    type Props = {
        author: Author;
        outroText?: string;
    };

    let { author, outroText }: Props = $props();
    const fileAvatar = $derived(
        author.avatarUrl ? null : getAuthorAvatar(author.id)
    );
</script>

<aside class="author-callout">
    {#if outroText}
        <p class="outro-text">{outroText}</p>
    {/if}

    <div class="author-card">
        <div class="avatar-section">
            {#if author.avatarUrl}
                <img
                    class="avatar"
                    src={author.avatarUrl}
                    alt={author.avatarAlt ?? `${author.name}'s avatar`}
                    width="56"
                    height="56"
                />
            {:else if fileAvatar}
                <Img
                    class="avatar"
                    src={fileAvatar}
                    alt="{author.name}'s avatar"
                    sizes="56px"
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
            {#if author.socials}
                <Socials {...author.socials} size="small" />
            {/if}
        </div>
    </div>
</aside>

<style lang="scss">
    @use '$styles/breakpoints';

    .author-callout {
        margin-top: 32px;
        padding: 24px;
        border-radius: 8px;
        background: var(--color--background);
        border: 1px solid rgba(var(--color--secondary-rgb), 0.12);

        @include breakpoints.for-phone-only {
            padding: 16px;
        }
    }

    .outro-text {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        letter-spacing: -0.01em;
        color: var(--color--secondary);
        margin: 0 0 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(var(--color--secondary-rgb), 0.08);

        @include breakpoints.for-phone-only {
            font-size: 13px;
            margin-bottom: 12px;
            padding-bottom: 12px;
        }
    }

    .author-card {
        display: flex;
        align-items: center;
        gap: 16px;

        @include breakpoints.for-phone-only {
            gap: 12px;
        }
    }

    .avatar-section {
        flex-shrink: 0;

        :global(.avatar) {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid rgba(var(--color--secondary-rgb), 0.1);
        }

        @include breakpoints.for-phone-only {
            :global(.avatar) {
                width: 48px;
                height: 48px;
            }
        }
    }

    .avatar-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        background: rgba(var(--color--secondary-rgb), 0.08);
        color: rgba(var(--color--secondary-rgb), 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        letter-spacing: -0.02em;

        @include breakpoints.for-phone-only {
            width: 48px;
            height: 48px;
            font-size: 16px;
        }
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .name {
        font-weight: 600;
        font-size: 14px;
        letter-spacing: -0.02em;
        color: var(--color--primary);
    }

    .bio {
        font-size: 13px;
        font-weight: 400;
        line-height: 1.5;
        color: rgba(var(--color--secondary-rgb), 0.7);
        margin: 0;
        max-width: 48ch;

        @include breakpoints.for-phone-only {
            font-size: 12px;
        }
    }

    .info-section :global(.socials) {
        margin-top: 8px;
        padding: 0;
        opacity: 0.6;
        transition: opacity 150ms cubic-bezier(0.25, 1, 0.5, 1);

        &:hover {
            opacity: 1;
        }
    }
</style>
