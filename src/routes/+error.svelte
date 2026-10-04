<script lang="ts">
    import { page } from '$app/state';
    import { homeHref } from '#lib/i18n/index.js';
    import Button from '#lib/components/atoms/Button.svelte';
    import Error from '#lib/icons/error.svelte';

    let notFound = $derived(page.status === 404);
</script>

<div class="error-page">
    <div class="container">
        <h1>{notFound ? 'Page not found' : 'Oh no!'}</h1>
        <div class="svg-wrapper">
            <Error />
        </div>
        <p>
            {#if notFound}
                This page doesn't exist. It may have moved, or the link has a
                typo.
            {:else}
                It seems like coffee was spilled all over this page, and now it
                can't be displayed.
            {/if}
        </p>
        <br />
        <Button href={homeHref('en', page.url.origin)}>Start over</Button>
    </div>
</div>

<style>
    .error-page {
        background: var(--color-surface);
        position: relative;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;

        .svg-wrapper {
            width: 300px;
            margin-top: calc(-1 * var(--space-section));
            margin-bottom: calc(-1 * var(--space-group));
        }
    }
</style>
