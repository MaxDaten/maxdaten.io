<script>
    import '#lib/scss/fonts.js';
    import '#lib/scss/global.css';
    import Analytics from '#lib/components/atoms/Analytics.svelte';
    import { Ssgoi } from 'ssgoi';
    import { transitionConfig } from '#lib/config/transitions.js';
    import { t } from '#lib/i18n/index.js';
    import { onNavigate } from '$app/navigation';
    import Header from '#lib/components/organisms/Header.svelte';
    import Footer from '#lib/components/organisms/Footer.svelte';
    import { page } from '$app/state';
    import { MetaTags, deepMerge, JsonLd } from 'svelte-meta-tags';
    import { setContext } from 'svelte';

    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     * @property {any} data
     */

    /** @type {Props} */
    let { children, data } = $props();

    // Locale comes from (de)/+layout.ts or en/+layout.ts; English-only routes default to 'en'
    let locale = $derived(page.data.locale ?? 'en');
    setContext('locale', () => locale);

    // hooks.server.ts sets <html lang> on the server render only; keep it in sync on client-side navigation
    $effect(() => {
        document.documentElement.lang = locale;
    });

    let metaTags = $derived(
        deepMerge(data.baseMetaTags, page.data.pageMetaTags || {})
    );

    let schemaGraph = $derived([
        ...data.baseSchema,
        ...(page.data.pageSchema || []),
    ]);
</script>

<MetaTags {...metaTags} />

<JsonLd schema={{ '@graph': schemaGraph }} />

<Analytics />
<Ssgoi {onNavigate} config={transitionConfig}>
    <div class="stage">
        <a class="skip-link" href="#main-content"
            >{t(locale, 'nav.skipToContent')}</a
        >
        <Header showBackground={true} />

        <main id="main-content" class="fill-height" tabindex="-1">
            {@render children?.()}
        </main>

        <Footer author={data.siteAuthor} />
    </div>
</Ssgoi>

<style>
    .skip-link {
        position: absolute;
        top: var(--space-inline);
        left: var(--space-inline);
        z-index: 100;
        padding: var(--space-inline) var(--space-tight);
        border-radius: var(--radius-button);
        background: var(--color-accent);
        color: var(--color-surface);
        font-weight: var(--font-weight-semibold);
        transform: translateY(-200%);

        &:focus {
            transform: none;
        }
    }

    main:focus {
        outline: none;
    }

    .stage {
        height: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .fill-height {
        position: relative;
        flex-grow: 1;
    }
</style>
