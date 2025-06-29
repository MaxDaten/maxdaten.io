<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Bubbles from '$components/organisms/Bubbles.svelte';

	const { Story } = defineMeta({
		title: 'Organisms/Bubbles',
		component: Bubbles,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'A beautiful bubble background effect with floating circles. Best viewed on desktop with reduced motion disabled.'
				}
			},
			layout: 'fullscreen'
		}
	});
</script>

<Story name="Square Canvas">
	{#snippet template()}
		<div
			style="width: 100vw; height: 100vh; position: relative; overflow: hidden; margin: 0 auto;"
		>
			<Bubbles />
			<div
				style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 3rem;"
			>
				<h2 style="margin: 0 0 2rem 0; font-size: 2.5rem; font-weight: 400;">
					Large Square Canvas
				</h2>
				<div
					style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 8px; max-width: 500px;"
				>
					<p style="margin: 0 0 1rem 0; font-size: 1.1rem;">
						This demonstrates the Bokeh effect in a larger, square format
						perfect for showcasing the full parallax motion.
					</p>
					<p style="margin: 0; opacity: 0.8;">
						The circles move based on your mouse position with smooth
						animations.
					</p>
				</div>
			</div>
		</div>
	{/snippet}
</Story>
