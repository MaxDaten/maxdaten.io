<script lang="ts">
	import GemCard from '$lib/components/molecules/GemCard.svelte';
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import type { GemEntry } from '$lib/utils/types';

	interface Props {
		data: {
			gems: GemEntry[];
		};
	}

	let { data }: Props = $props();

	let { gems } = data;
</script>

<div class="container">
	<ContentSection title="Gems of Precious Friends">
		<div class="grid">
			{#each gems as gem}
				<GemCard
					title={gem.title}
					coverImage={gem.coverImage}
					excerpt={gem.description}
					href={gem.link}
					tags={gem.tags}
				/>
			{/each}
		</div>
	</ContentSection>
</div>

<style lang="scss">
	@use '$lib/scss/_mixins.scss';
	@use '$lib/scss/_breakpoints.scss';

	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-gap: 20px;

		@include breakpoints.for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}

		@include breakpoints.for-tablet-landscape-up {
			// Select every 6 elements, starting from position 1
			// And make it take up 6 columns
			> :global(:nth-child(6n + 1)) {
				grid-column: span 6;
			}
			// Select every 6 elements, starting from position 2
			// And make it take up 3 columns
			> :global(:nth-child(6n + 2)) {
				grid-column: span 3;
			}
			// Select every 6 elements, starting from position 3
			// And make it take up 3 columns
			> :global(:nth-child(6n + 3)) {
				grid-column: span 3;
			}
			// Select every 6 elements, starting from position 4, 5 and 6
			// And make it take up 2 columns
			> :global(:nth-child(6n + 4)),
			:global(:nth-child(6n + 5)),
			:global(:nth-child(6n + 6)) {
				grid-column: span 2;
			}
		}
	}
</style>
