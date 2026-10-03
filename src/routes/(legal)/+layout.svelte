<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<article class="legal">
    {@render children()}
</article>

<style>
    .legal {
        width: min(680px, 100%);
        margin: 0 auto;
        padding: var(--space-section) var(--raw-space-16) var(--space-page);
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-16);

        @media (min-width: 768px) {
            padding-left: var(--raw-space-24);
            padding-right: var(--raw-space-24);
        }

        :global(h1) {
            font-size: var(--text-heading-1);
            font-weight: var(--font-weight-semibold);
            line-height: var(--text-heading-leading);
            letter-spacing: -0.02em;
            text-wrap: balance;
        }

        :global(h2) {
            font-size: var(--text-heading-3);
            font-weight: var(--font-weight-semibold);
            margin-top: var(--raw-space-24);
        }

        :global(h3) {
            font-size: var(--text-heading-4);
            font-weight: var(--font-weight-semibold);
            margin-top: var(--raw-space-16);
        }

        :global(ul) {
            padding-left: var(--raw-space-24);
            list-style: disc;
        }

        :global(.stand) {
            color: var(--color-text-muted);
            font-size: var(--raw-text-sm);
        }
    }
</style>
