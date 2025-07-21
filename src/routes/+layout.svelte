<script>
    import '$lib/scss/global.scss';
    import Analytics from '$components/atoms/Analytics.svelte';
    import { Ssgoi } from 'ssgoi';
    import { transitionConfig } from '$lib/config/transitions';
    import { onNavigate } from '$app/navigation';
    import Header from '$components/organisms/Header.svelte';
    import Footer from '$components/organisms/Footer.svelte';
    import { page } from '$app/state';
    import { MetaTags, deepMerge } from 'svelte-meta-tags';

    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     * @property {any} data
     */

    /** @type {Props} */
    let { children, data } = $props();

    let metaTags = $derived(
        deepMerge(data.baseMetaTags, page.data.pageMetaTags || {})
    );
</script>

<MetaTags {...metaTags} />

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

<style lang="scss">
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
