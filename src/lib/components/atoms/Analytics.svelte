<script lang="ts">
    let isProduction = import.meta.env.MODE === 'production';
</script>

<svelte:head>
    {#if isProduction}
        <script
            defer
            src="/scitylana/js/script.js"
            data-api="/scitylana/api/event"
            data-domain="maxdaten.io"
        ></script>
    {/if}
</svelte:head>
