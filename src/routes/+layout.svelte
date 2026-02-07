<script>
    import '$lib/scss/fonts';
    import '$lib/scss/global.css';
    import Analytics from '$components/atoms/Analytics.svelte';
    import { Ssgoi } from 'ssgoi';
    import { transitionConfig } from '$lib/config/transitions';
    import { onNavigate } from '$app/navigation';
    import Header from '$components/organisms/Header.svelte';
    import Footer from '$components/organisms/Footer.svelte';
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
        <Header showBackground={true} />

        <main class="fill-height">
            {@render children?.()}
        </main>

        <Footer />
    </div>
</Ssgoi>

<style>
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
