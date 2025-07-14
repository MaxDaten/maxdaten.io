<script>
    import '$lib/scss/global.scss';
    import Analytics from '$components/atoms/Analytics.svelte';
    import { Ssgoi } from 'ssgoi';
    import { transitionConfig } from '$lib/config/transitions';
    import { onNavigate } from '$app/navigation';
    import Header from '$components/organisms/Header.svelte';
    import Footer from '$components/organisms/Footer.svelte';
    import {
        description,
        image,
        keywords,
        siteBaseUrl,
        title,
    } from '$lib/data/meta.js';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<svelte:head>
    <link rel="“canonical”" href={siteBaseUrl} />
    <meta name="keywords" content={keywords.join(', ')} />

    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />

    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />

    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />

    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

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
