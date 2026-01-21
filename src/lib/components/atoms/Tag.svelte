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

<style lang="scss">
    .tag {
        font-family: var(--font--mono), monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--raw-space-4);
        padding: var(--space-tag-y) var(--space-tag-x);
        border-radius: var(--radius-tag);
        font-weight: 500;
        font-size: var(--raw-text-sm);
        width: fit-content;
        white-space: nowrap;

        border: 0.5px solid;

        &.primary {
            background-color: rgba(
                var(--color-accent-rgb),
                var(--raw-opacity-light)
            );
            color: var(--color-accent);
            border-color: rgba(
                var(--color-accent-rgb),
                var(--raw-opacity-muted)
            );
        }

        &.secondary {
            background-color: rgba(
                var(--color-text-rgb),
                var(--raw-opacity-subtle)
            );
            color: var(--color-text);
            border-color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));
        }
    }
</style>
