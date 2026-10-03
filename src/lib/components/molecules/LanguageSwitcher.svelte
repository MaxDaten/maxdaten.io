<script lang="ts">
    import { getContext } from 'svelte';
    import { localeDomains, type Locale } from '#lib/i18n/index.js';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    // Both links go to the home page in that language; only the home page is translated.
    const deHref = `${localeDomains.de}/`;
    const enHref = `${localeDomains.en}/en`;
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve — external domain links -->
<span class="language-switcher">
    <a
        href={deHref}
        class:active={locale === 'de'}
        hreflang="de"
        aria-label="Deutsch">DE</a
    >
    <span class="separator">|</span>
    <a
        href={enHref}
        class:active={locale === 'en'}
        hreflang="en"
        aria-label="English">EN</a
    >
</span>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
    .language-switcher {
        display: flex;
        align-items: center;
        gap: var(--raw-space-4);
        font-family: var(--font--mono), monospace;
        font-size: var(--raw-text-sm);
    }

    .separator {
        color: var(--color-text);
        opacity: 0.3;
    }

    a {
        text-decoration: none;
        color: var(--color-text);
        opacity: 0.5;
        transition: opacity 0.15s ease;
        padding: var(--raw-space-4);

        &:hover {
            opacity: 1;
            color: var(--color-accent);
        }

        &.active {
            opacity: 1;
            color: var(--color-accent);
        }
    }
</style>
