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
                    width="80"
                    height="80"
                />
            {:else if fileAvatar}
                <Img
                    class="avatar"
                    src={fileAvatar}
                    alt="{author.name}'s avatar"
                    sizes="80px"
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
                <Socials {...author.socials} size="medium" />
            {/if}
        </div>
    </div>
</aside>

<style lang="scss">
    @use '$styles/mixins';
    @use '$styles/breakpoints';

    .author-callout {
        margin-top: 3rem;
        padding: 1.5rem;
        border-radius: 12px;
        background: rgba(var(--color--primary-rgb), 0.05);
        border: 1px solid rgba(var(--color--primary-rgb), 0.15);

        @include breakpoints.for-phone-only {
            padding: 1rem;
        }
    }

    .outro-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--color--secondary);
        margin-bottom: 1.5rem;
        text-align: center;

        @include breakpoints.for-phone-only {
            font-size: 1rem;
            margin-bottom: 1rem;
        }
    }

    .author-card {
        display: flex;
        align-items: flex-start;
        gap: 1.25rem;

        @include breakpoints.for-phone-only {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
    }

    .avatar-section {
        flex-shrink: 0;

        :global(.avatar) {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(var(--color--primary-rgb), 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
    }

    .avatar-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(
            135deg,
            var(--color--primary),
            var(--color--primary-dark)
        );
        color: var(--color--primary-contrast);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 2rem;
        border: 2px solid rgba(var(--color--primary-rgb), 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        @include breakpoints.for-phone-only {
            align-items: center;
        }
    }

    .name {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--color--primary);
    }

    .bio {
        font-size: 0.95rem;
        line-height: 1.5;
        color: rgba(var(--color--secondary-rgb), 0.85);
        margin: 0;
        max-width: 50ch;

        @include breakpoints.for-phone-only {
            font-size: 0.9rem;
        }
    }

    .info-section :global(.socials) {
        margin-top: 0.5rem;
        padding: 0;
    }
</style>
