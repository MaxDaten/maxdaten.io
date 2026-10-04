<script lang="ts">
    interface Props {
        color?: 'primary' | 'secondary';
        children?: import('svelte').Snippet;
    }

    let { color = 'primary', children }: Props = $props();
</script>

<div class="tag {color}">
    {@render children?.()}
</div>

<style>
    .tag {
        font-family: var(--font--mono), monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-hairline);
        padding: var(--space-tag-y) var(--space-tag-x);
        border-radius: var(--radius-tag);
        font-weight: 500;
        font-size: var(--text-small);
        width: fit-content;
        white-space: nowrap;

        border: 0.5px solid;

        &.primary {
            background-color: rgba(
                var(--color-accent-rgb),
                var(--opacity-wash)
            );
            color: var(--color-accent-text);
            border-color: rgba(
                var(--color-accent-rgb),
                var(--opacity-border)
            );
        }

        &.secondary {
            background-color: rgba(
                var(--color-text-rgb),
                var(--opacity-tint)
            );
            color: var(--color-text);
            border-color: rgba(var(--color-text-rgb), var(--opacity-border));
        }
    }
</style>
