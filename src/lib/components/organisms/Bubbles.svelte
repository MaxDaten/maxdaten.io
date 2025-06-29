<script>
</script>

<div class="bubbles" style="display: none;">
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
	<div class="bubble"></div>
</div>

<style lang="scss">
	@use 'sass:math';
	@use 'sass:list';
	@use 'sass:color';
	@use '$lib/scss/_breakpoints.scss';

	$bubble-count: 50;
	$sway-type: 'sway-left-to-right', 'sway-right-to-left';

	@function random_range($seed, $min, $max) {
		$rand: math.sin($seed * 12.9898) * 43758.5453;
		$rand: $rand - math.floor($rand);
		$range: $max - $min;
		@return $min + $rand * $range;
	}

	.bubbles {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: var(--background-layer);

		@include breakpoints.for-desktop-up {
			// display: none in inline style fixed popping in svg before css is parsed
			display: block !important;
		}
	}

	.bubble {
		will-change: transform;
		position: absolute;
		left: var(--bubble-left-offset);
		top: var(--bubble-top-offset);
		display: block;
		width: var(--bubble-radius);
		height: var(--bubble-radius);
		border-radius: 50%;
		mix-blend-mode: screen;
		@media screen and (prefers-reduced-motion: no-preference) {
			animation:
				float-up var(--bubble-float-duration) 0s ease-in-out alternate infinite,
				filt 15s linear infinite;
		}

		&::before {
			position: absolute;
			content: '';
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: hsla(var(--bubble-hue), 94%, 76%, var(--bubble-opacity));
			border-radius: inherit;
			inset: 10px;
			border: 5px solid
				hsla(var(--bubble-hue), 100%, 90%, var(--bubble-opacity));

			filter: blur(calc(var(--bubble-radius) / 3));
			z-index: 1;

			@media screen and (prefers-reduced-motion: no-preference) {
				animation: var(--bubble-sway-type) var(--bubble-sway-duration)
					var(--bubble-sway-delay) ease-in-out alternate infinite;
			}
		}

		@for $i from 1 through $bubble-count + 1 {
			&:nth-child(#{$i}) {
				--bubble-opacity: #{random_range($i + 1, 0.1, 0.2)};
				--bubble-hue: #{random_range($i + 2, 0, 360)};
				--bubble-left-offset: #{random_range($i + 3, 0vw, 100vw)};
				--bubble-top-offset: #{random_range($i + 4, 0vh, 100vh)};
				--bubble-radius: #{random_range($i + 5, 30px, 250px)};
				--bubble-float-duration: #{random_range($i + 6, 40s, 60s)};
				--bubble-sway-duration: #{random_range($i + 7, 4s, 6s)};
				--bubble-sway-delay: #{random_range($i + 9, 0s, 4s)};
				--bubble-sway-type: #{list.nth(
						$sway-type,
						$i % list.length($sway-type) + 1
					)};
			}
		}
	}

	@keyframes filt {
		0% {
			filter: hue-rotate(0deg);
		}
		to {
			filter: hue-rotate(360deg);
		}
	}

	@keyframes float-up {
		to {
			transform: translate(-100vh, -100vw);
			scale: 20%;
		}
	}

	@keyframes sway-left-to-right {
		from {
			transform: translateX(-100%);
		}

		to {
			transform: translateX(100%);
		}
	}

	@keyframes sway-right-to-left {
		from {
			transform: translateX(100%);
		}

		to {
			transform: translateX(-100%);
		}
	}
</style>
