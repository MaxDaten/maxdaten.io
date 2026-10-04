<script lang="ts">
    import { resolve } from '$app/paths';
    import RssIcon from '#lib/icons/rss.svelte';
</script>

<a
    href={resolve('rss.xml')}
    target="_blank"
    rel="noopener noreferrer"
    title="Subscribe to my RSS Feed"
>
    <RssIcon />
</a>

<style>
    /* Padded to a 44px touch target; the negative margin keeps the layout at the icon's size */
    a {
        --icon-size: 24px;
        --tap-pad: calc((var(--size-tap-target) - var(--icon-size)) / 2);

        box-sizing: content-box;
        display: flex;
        width: var(--icon-size);
        padding: var(--tap-pad);
        margin: calc(-1 * var(--tap-pad));
        transition: all 0.2s ease-in-out;
        color: var(--color-text);
        fill: var(--color-text);

        &:hover {
            color: var(--color-accent);
            fill: var(--color-accent);
            filter: drop-shadow(0px 0px 3px var(--color-accent));
        }
    }
</style>
