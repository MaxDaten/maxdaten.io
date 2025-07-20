<script lang="ts">
    import type { Author } from '$lib/utils/types';
    import Img from '@zerodevx/svelte-img';
    import { getAuthorAvatar } from '$lib/utils/image-loader';

    type Props = {
        author: Author;
    };

    let { author }: Props = $props();
    const avatar = getAuthorAvatar(author.id);
</script>

<div class="author">
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
    <span class="name">{author.name}</span>
</div>

<style lang="scss">
    .author {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 0.9rem;
        color: rgba(var(--color--secondary-rgb), 0.8);
        padding: 8px 10px;
        background: rgba(var(--color--primary-rgb), 0.05);
        border-radius: 12px;
        border: 1px solid rgba(var(--color--primary-rgb), 0.3);
        transition: all 0.3s ease;

        &:hover {
            background: rgba(var(--color--primary-rgb), 0.08);
            border-color: rgba(var(--color--primary-rgb), 0.2);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    }

    :global(.avatar) {
        width: 44px;
        height: 44px;
        border-radius: 14%;
        overflow: hidden;
        object-fit: cover;
        border: 1px solid rgba(var(--color--primary-rgb), 0.3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;

        .author:hover & {
            transform: scale(1.05);
        }
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

        &::before {
            content: 'Written by';
            display: block;
            font-size: 0.75rem;
            font-weight: 400;
            color: rgba(var(--color--secondary-rgb), 0.7);
            letter-spacing: 0.3px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
    }
</style>
