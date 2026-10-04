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
        padding: var(--space-section) var(--space-stack) var(--space-page);
        display: flex;
        flex-direction: column;
        gap: var(--space-stack);

        @media (min-width: 768px) {
            padding-left: var(--space-block);
            padding-right: var(--space-block);
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
            margin-top: var(--space-block);
        }

        :global(h3) {
            font-size: var(--text-heading-4);
            font-weight: var(--font-weight-semibold);
            margin-top: var(--space-stack);
        }

        :global(ul) {
            padding-left: var(--space-block);
            list-style: disc;
        }

        :global(.stand) {
            color: var(--color-text-muted);
            font-size: var(--text-small);
        }
    }
</style>
