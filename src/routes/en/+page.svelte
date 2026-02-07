<script lang="ts">
    import HomePage from '$lib/pages/HomePage.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<HomePage posts={data.posts} />
