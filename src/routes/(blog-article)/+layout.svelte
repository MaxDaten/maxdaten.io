<script lang="ts">
    import Header from '$lib/components/organisms/Header.svelte';
    import Footer from '$lib/components/organisms/Footer.svelte';

    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="article-layout">
    <Header showBackground />

    <main>
        {@render children?.()}
    </main>

    <Footer />
</div>

<style lang="scss">
    .article-layout {
        --body-background-color: var(--color--post-page-background);
        background-color: var(--color--post-page-background);
    }
</style>
