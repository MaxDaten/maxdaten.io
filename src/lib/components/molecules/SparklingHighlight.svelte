<script lang="ts">
	import Sparkles from '$lib/components/atoms/Sparkles.svelte';

	interface Props {
		color?: 'default' | 'primary' | 'secondary';
		sparkleColor?: 'default' | 'primary' | 'secondary';
		children?: import('svelte').Snippet;
	}

	let {
		color = 'default',
		sparkleColor = 'default',
		children
	}: Props = $props();
</script>

<Sparkles color={sparkleColor}
	><strong class={color}>{@render children?.()}</strong></Sparkles
>

<style lang="scss">
	strong {
		&.primary {
			color: var(--color--primary);
		}
		&.secondary {
			color: var(--color--secondary);
		}
	}
</style>
