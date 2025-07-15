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
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 5px 15px;
        border-radius: 10px;
        font-weight: 500;
        font-size: 0.85rem;
        width: fit-content;
        white-space: nowrap;

        border: 0.5px solid;

        &.primary {
            background-color: var(--color--primary-tint);
            color: var(--color--primary);
            border-color: rgba(var(--color--primary-rgb), 0.3);
        }

        &.secondary {
            background-color: var(--color--secondary-tint);
            color: var(--color--secondary);
            border-color: rgba(var(--color--secondary-rgb), 0.3);
        }
    }
</style>
