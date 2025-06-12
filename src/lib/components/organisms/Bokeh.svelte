<script lang="ts">
	let xScale = 0;
	let yScale = 0;
	let parallaxX = $state(0);
	let parallaxY = $state(0);

	const domousemove = (e: any) => {
		xScale = e.clientX / window.innerWidth - 0.5;
		yScale = e.clientY / window.innerHeight - 0.5;

		parallaxX = xScale * 10;
		parallaxY = yScale * 10;
	};

	let bokehCount = 25;
</script>

<svelte:window onmousemove={domousemove} />
<div class="bokeh-container" style="display: none;">
	<svg class="bokeh" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<g class="parallax">
			{#each Array.from({ length: bokehCount }) as _, i}
				<circle
					cx="{50 + parallaxX * (i / bokehCount)}%"
					cy="{50 + parallaxY * (i / bokehCount)}%"
					r="45%"
				/>
			{/each}
		</g>
	</svg>
</div>

<style lang="scss">
	@import '$lib/scss/_breakpoints.scss';
	$bokehCount: 25;
	$bokehBaseSize: 11rem;
	$bokehBaseOpacity: 0.1;
	$bokehBaseBrightness: 100;
	$bokehBaseAnimationDuration: 50s;
	$colorSet: (rgb(56, 133, 249), rgb(255, 16, 16), rgb(255, 85, 0), rgb(19, 227, 227));

	.bokeh-container {
		@include for-desktop-up {
			// display: none in inline style fixed popping in svg before css is parsed
			display: block !important;
		}
		position: absolute;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		opacity: 0.5;
		z-index: var(--background-layer);
	}

	.bokeh {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		backface-visibility: hidden;
	}

	.parallax > circle {
		@media screen and (prefers-reduced-motion: no-preference) {
			animation-name: floating-bokeh;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
		}
	}

	@for $i from 1 through $bokehCount {
		.parallax > circle:nth-child(#{$i}) {
			mix-blend-mode: overlay;
			--random-translate-x: #{random() * 100% - 25%};
			--random-translate-y: #{random() * 100% - 25%};
			--random-scale: #{0.1 + random() * 0.3};

			$depth: $i;
			transform: translate3d(var(--random-translate-x), var(--random-translate-y), $i * 1px)
				scale(var(--random-scale));

			$baseColor: nth($colorSet, random(length($colorSet)));
			$depthAdjustedColor: adjust-color($baseColor, $saturation: ($i * -1%));
			fill: $baseColor;
			stroke: lighten($baseColor, 50%);
			opacity: $bokehBaseOpacity + random(1) * 0.01;
			filter: brightness($bokehBaseBrightness + random() * 150%) blur(6px * random() + 2px);
			transform-origin: (random() * 100% - 50%) (random() * 100% - 50%);
			animation-duration: $bokehBaseAnimationDuration + random(30) * 1s;
		}
	}

	@keyframes floating-bokeh {
		100% {
			transform: translate3d(var(--random-translate-x), var(--random-translate-y), 0)
				scale(var(--random-scale)) rotate(360deg);
		}
	}
</style>
