<script lang="ts">
	import '$lib/scss/global.scss';
	import type { Hst } from '@histoire/plugin-svelte';
	import Bokeh from './Bokeh.svelte';

	export let Hst: Hst;
</script>

<Hst.Story title="Organisms/Bokeh" layout={{ type: 'single', iframe: true }}>
	<Bokeh />
</Hst.Story>
