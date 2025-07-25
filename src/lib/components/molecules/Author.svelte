<script lang="ts">
    import type { Author } from '$lib/utils/types';
    import Img from '@zerodevx/svelte-img';
    import { getAuthorAvatar } from '$lib/utils/image-loader';
    import Socials from '$components/molecules/Socials.svelte';

    type Props = {
        author: Author;
    };

    let { author }: Props = $props();
    const avatar = getAuthorAvatar(author.id);
</script>

<div class="author">
    <div class="author-info">
        {#if avatar}
            <Img
                class="avatar"
                src={avatar}
                alt="{author.name}'s avatar"
                sizes="44px"
            />
        {:else}
            <div class="avatar-placeholder" aria-label="{author.name}'s avatar">
                {author.name.charAt(0).toUpperCase()}
            </div>
        {/if}
        <div class="author-details" aria-label="{author.name}'s details">
            <span class="name">{author.name}</span>
            {#if author.socials}
                <Socials {...author.socials} size="small" />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @use '$styles/mixins';
    @use '$styles/breakpoints';

    .author {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-size: 0.9rem;
        color: rgba(var(--color--secondary-rgb), 0.8);
        transition: all 0.3s ease;

        @include breakpoints.for-phone-only {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
    }

    .author-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .author-details {
            display: flex;
            flex-direction: column;
            gap: 4px;

            :global(.socials) {
                padding: 0 16px;
            }
        }

        @include breakpoints.for-phone-only {
            gap: 8px;
        }
    }

    :global(.avatar) {
        width: 44px;
        height: 44px;
        border-radius: 20%;
        overflow: hidden;
        object-fit: cover;
        border: 1px solid rgba(var(--color--primary-rgb), 0.3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
    }

    .avatar-placeholder {
        width: 44px;
        height: 44px;
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
        font-size: 1.2rem;
        border: 2px solid rgba(var(--color--primary-rgb), 0.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .name {
        font-weight: 600;
        color: var(--color--primary);
        letter-spacing: 0.2px;
        position: relative;
    }
</style>
