<script lang="ts">
    import Alert from '$lib/icons/alert.svelte';
    import Check from '$lib/icons/check.svelte';
    import Info from '$lib/icons/info.svelte';

    interface Props {
        type?: 'info' | 'warning' | 'error' | 'success' | undefined;
        children?: import('svelte').Snippet;
    }

    let { type = undefined, children }: Props = $props();
</script>

<aside class="callout {type ?? 'default'}">
    {#if type}
        <div class="icon">
            {#if type === 'info'}
                <Info />
            {:else if type === 'warning' || type === 'error'}
                <Alert />
            {:else if type === 'success'}
                <Check />
            {/if}
        </div>
    {/if}
    <div class="content">
        {@render children?.()}
    </div>
</aside>

<style>
    .callout {
        --callout-accent: var(--color-text-muted);
        --callout-accent-rgb: var(--color-text-rgb);

        display: flex;
        gap: var(--raw-space-12);
        margin: var(--raw-space-24) 0;
        padding: var(--raw-space-16);
        border-radius: var(--radius-callout);
        background: rgba(var(--callout-accent-rgb), var(--raw-opacity-subtle));
        border-left: 3px solid var(--callout-accent);

        &.info {
            --callout-accent: var(--color-info);
            --callout-accent-rgb: var(--color-info-rgb);
        }

        &.warning {
            --callout-accent: var(--color-warning);
            --callout-accent-rgb: var(--color-warning-rgb);
        }

        &.error {
            --callout-accent: var(--color-error);
            --callout-accent-rgb: var(--color-error-rgb);
        }

        &.success {
            --callout-accent: var(--color-success);
            --callout-accent-rgb: var(--color-success-rgb);
        }
    }

    .icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: var(--callout-accent);

        :global(svg) {
            width: 100%;
            height: 100%;
        }
    }

    .content {
        flex: 1;
        min-width: 0;
        font-size: var(--raw-text-sm);
        line-height: var(--raw-leading-relaxed);
        color: var(--color-text);

        :global(p) {
            margin: 0;
        }

        :global(p + p) {
            margin-top: var(--raw-space-8);
        }

        :global(a) {
            color: var(--callout-accent);
            text-decoration: underline;
            text-underline-offset: 2px;

            &:hover {
                text-decoration-thickness: 2px;
            }
        }

        :global(code) {
            font-size: 0.9em;
            padding: 0.15em 0.4em;
            border-radius: var(--raw-radius-xs);
            background: rgba(var(--color-text-rgb), var(--raw-opacity-subtle));
        }
    }
</style>
