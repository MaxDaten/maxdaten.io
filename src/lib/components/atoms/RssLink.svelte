<script lang="ts">
    import { page } from '$app/state';
    import RssIcon from '#lib/icons/rss.svelte';
    import { getContext } from 'svelte';
    import { siteHref, t, type Locale } from '#lib/i18n/index.js';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- the feed lives on www.maxdaten.io -->
<a
    href={siteHref('/rss.xml', page.url.origin)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={t(locale, 'social.rss')}
    title={t(locale, 'social.rss')}
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
        transition-property: color, fill, filter;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
        color: var(--color-text);
        fill: var(--color-text);

        &:hover {
            color: var(--color-accent);
            fill: var(--color-accent);
            filter: drop-shadow(0px 0px 3px var(--color-accent));
        }
    }
</style>
