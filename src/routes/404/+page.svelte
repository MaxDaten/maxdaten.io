<script>
    import { page } from '$app/state';
    import { homeHref } from '#lib/i18n/index.js';
    import Button from '#lib/components/atoms/Button.svelte';
    import Error from '#lib/icons/error.svelte';
    import { PageTransition } from 'ssgoi';
</script>

<PageTransition>
    <div class="error-page">
        <div class="container">
            <h1>Oh no! 404!</h1>
            <div class="svg-wrapper">
                <Error />
            </div>
            <p>
                It seems like coffee was spilled all over this page, and now it
                can't be displayed.
            </p>
            <br />
            <Button href={homeHref('en', page.url.origin)}>Start over</Button>
        </div>
    </div>
</PageTransition>

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
