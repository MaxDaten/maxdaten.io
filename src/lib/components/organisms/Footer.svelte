<script>
	import FooterWave from '$lib/icons/footer-wave.svelte';
	import Socials from '$lib/components/molecules/Socials.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import RssLink from '$lib/components/atoms/RssLink.svelte';
</script>

<footer>
	<!-- <div class="wave">
		<FooterWave />
	</div> -->
	<div class="content">
		<div class="credits">
			Powered by <a
				href="https://kit.svelte.dev/"
				target="_blank"
				rel="noopener noreferrer">SvelteKit</a
			>. Icons by
			<a href="https://iconoir.com/" target="_blank" rel="noopener noreferrer"
				>Iconoir</a
			>.
		</div>
		<div class="copyright">
			Based on a <a
				href="https://github.com/matfantinel/sveltekit-static-blog-template"
				target="_blank"
				rel="noopener noreferrer">template</a
			>
			built by
			<a
				href="https://fantinel.dev?utm_source=maxdaten.io&utm_medium=footer&utm_campaign=blog"
				target="_blank"
				rel="noopener noreferrer">Matheus Fantinel</a
			>.
		</div>
		<div class="socials">
			<Socials />
			<RssLink />
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		width: 100%;
		background: linear-gradient(
			60deg,
			var(--color--waves-start) 0%,
			var(--color--waves-end) 100%
		);
		border-top: 1px solid var(--color--waves-start);

		display: grid;
		grid-template-rows: 120px 1fr;

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 15px;
			font-weight: 600;
			text-align: center;

			.copyright {
				font-size: 80%;
				color: var(--color--text-shade);
			}

			.credits {
				font-weight: 400;
				font-size: 90%;
				color: var(--color--text-shade);
			}

			.socials {
				display: flex;
				align-items: center;
				gap: 20px;
			}
		}

		a {
			&:hover {
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
