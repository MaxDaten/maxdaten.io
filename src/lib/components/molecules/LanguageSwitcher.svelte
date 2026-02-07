<script lang="ts">
    import { getContext } from 'svelte';
    import { page } from '$app/state';
    import { localeDomains, isTranslatedRoute, type Locale } from '$lib/i18n';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    // On translated pages, link to the alternate domain's home page.
    // On English-only pages (blog, gems), link to the other domain's home page.
    let deHref = $derived(
        isTranslatedRoute(page.url.pathname)
            ? `${localeDomains.de}/`
            : `${localeDomains.de}/`
    );
    let enHref = $derived(
        isTranslatedRoute(page.url.pathname)
            ? `${localeDomains.en}/en/`
            : `${localeDomains.en}/`
    );
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
