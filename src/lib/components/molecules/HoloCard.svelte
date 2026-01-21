<script lang="ts">
    import type { Snippet } from 'svelte';
    import { MediaQuery } from 'svelte/reactivity';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    // Reference to the card element
    let cardElement: HTMLElement | undefined = $state();

    // Track mouse position relative to card center
    let rotateX = $state(0);
    let rotateY = $state(0);
    let sheenX = $state(50);
    let sheenY = $state(50);

    // Check for reduced motion preference using Svelte's reactive MediaQuery
    const reducedMotionQuery = new MediaQuery(
        'prefers-reduced-motion: reduce',
        false
    );
    let prefersReducedMotion = $derived(reducedMotionQuery.current);

    // Global mouse tracking - responds to mouse anywhere on page
    $effect(() => {
        if (prefersReducedMotion || typeof window === 'undefined') return;

        function handleGlobalMouseMove(event: MouseEvent) {
            if (!cardElement) return;

            const rect = cardElement.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Calculate offset from card center
            const offsetX = event.clientX - cardCenterX;
            const offsetY = event.clientY - cardCenterY;

            // Normalize by viewport size for consistent effect across screen
            const maxDistance =
                Math.max(window.innerWidth, window.innerHeight) / 2;
            const normalizedX = Math.max(
                -1,
                Math.min(1, offsetX / maxDistance)
            );
            const normalizedY = Math.max(
                -1,
                Math.min(1, offsetY / maxDistance)
            );

            // Convert to rotation angles (-15 to 15 degrees)
            rotateY = normalizedX * 15;
            rotateX = -normalizedY * 15;

            // Sheen follows mouse relative to card bounds
            const sheenNormX = (event.clientX - rect.left) / rect.width;
            const sheenNormY = (event.clientY - rect.top) / rect.height;
            sheenX = Math.max(0, Math.min(100, sheenNormX * 100));
            sheenY = Math.max(0, Math.min(100, sheenNormY * 100));
        }

        window.addEventListener('mousemove', handleGlobalMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    });
</script>

<div class="holo-card-container">
    <div
        bind:this={cardElement}
        class="holo-card"
        class:reduced-motion={prefersReducedMotion}
        style:--rotate-x="{rotateX}deg"
        style:--rotate-y="{rotateY}deg"
        style:--sheen-x="{sheenX}%"
        style:--sheen-y="{sheenY}%"
        role="presentation"
    >
        {@render children()}
    </div>
</div>

<style>
    .holo-card-container {
        perspective: 1000px;
    }

    .holo-card {
        position: relative;
        transform-style: preserve-3d;
        transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
        transition: transform 0.15s ease-out;
        background-color: var(--color-surface-elevated);
        border-radius: var(--radius-card);
        padding: var(--raw-space-24);
        overflow: hidden;
    }

    .holo-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at var(--sheen-x, 50%) var(--sheen-y, 50%),
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted)) 0%,
            rgba(var(--color-accent-rgb), var(--raw-opacity-light)) 25%,
            rgba(var(--color-accent-rgb), var(--raw-opacity-subtle)) 50%,
            transparent 70%
        );
        opacity: 1;
        transition: opacity 0.15s ease-out;
        pointer-events: none;
        border-radius: inherit;
    }

    /* Disable all animations for reduced motion */
    .holo-card.reduced-motion {
        transform: none;
        transition: none;
    }

    .holo-card.reduced-motion::before {
        display: none;
    }
</style>
