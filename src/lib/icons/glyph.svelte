<script lang="ts">
    /** The craft's glyphs in the icon set's 1.5 stroke: λ for functional programming, a cube for
     * platforms, a loop for continuous delivery, a pointer for product UI, braces and a prompt for
     * code, plus the sparkle glint. */
    export type GlyphKind =
        | 'lambda'
        | 'cube'
        | 'loop'
        | 'pointer'
        | 'braces'
        | 'prompt'
        | 'sparkle';

    interface Props {
        kind: GlyphKind;
        width?: string;
        height?: string;
    }

    let { kind, width = '24px', height = '24px' }: Props = $props();
</script>

{#if kind === 'sparkle'}
    <svg
        {width}
        {height}
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
            fill="currentColor"
        />
    </svg>
{:else}
    <svg
        {width}
        {height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
    >
        {#if kind === 'lambda'}
            <path d="M5 3.75h2.4a2 2 0 0 1 1.78 1.09L17 20.25h2" />
            <path d="M11.75 9.75 5.5 20.25" />
        {:else if kind === 'cube'}
            <path d="M12 2.75 20 7.25v9.5l-8 4.5-8-4.5v-9.5z" />
            <path d="m4 7.25 8 4.5 8-4.5" />
            <path d="M12 11.75v9.5" />
        {:else if kind === 'loop'}
            <path
                d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z"
            />
        {:else if kind === 'pointer'}
            <path d="m4.5 4.5 5.75 15 2.25-6.25 6.25-2.25z" />
            <path d="m12.5 13.25 6 6" />
        {:else if kind === 'braces'}
            <path
                d="M8 3.5H7a2 2 0 0 0-2 2v4c0 1.4-.9 2.5-2 2.5 1.1 0 2 1.1 2 2.5v4a2 2 0 0 0 2 2h1"
            />
            <path
                d="M16 3.5h1a2 2 0 0 1 2 2v4c0 1.4.9 2.5 2 2.5-1.1 0-2 1.1-2 2.5v4a2 2 0 0 1-2 2h-1"
            />
        {:else}
            <path d="m4.5 17 6-5-6-5" />
            <path d="M12.5 19h7" />
        {/if}
    </svg>
{/if}
