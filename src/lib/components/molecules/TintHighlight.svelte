<script lang="ts">
    interface Props {
        color?: 'primary' | 'secondary' | string;
        children?: import('svelte').Snippet;
    }

    let { color = 'primary', children }: Props = $props();
</script>

<mark style="--mark-color: var(--color--{color}-tint);">
    {@render children?.()}
</mark>

<style>
    mark {
        --mark-color: transparent;

        margin-inline: calc(0.1em * -1);
        padding-inline: 0.1em;

        background-color: transparent;
        background-image: linear-gradient(
            to bottom,
            transparent 60%,
            var(--mark-color) 60%
        );

        color: inherit;
    }
</style>
