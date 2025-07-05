<script>
    import '$lib/scss/global.scss';
    import Analytics from '$components/atoms/Analytics.svelte';
    import { Ssgoi } from 'ssgoi';
    import { transitionConfig } from '$lib/config/transitions';
    import { onNavigate } from '$app/navigation';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<Analytics />
<Ssgoi {onNavigate} config={transitionConfig}>
    {@render children?.()}
</Ssgoi>
