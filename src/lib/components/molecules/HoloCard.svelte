<script lang="ts">
    import type { Snippet } from 'svelte';
    import { MediaQuery } from 'svelte/reactivity';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    // Track mouse position relative to card center
    let rotateX = $state(0);
    let rotateY = $state(0);
    let sheenX = $state(50);
    let sheenY = $state(50);
    let isHovering = $state(false);

    // Check for reduced motion preference using Svelte's reactive MediaQuery
    const reducedMotionQuery = new MediaQuery(
        'prefers-reduced-motion: reduce',
        false
    );
    let prefersReducedMotion = $derived(reducedMotionQuery.current);

    function handleMouseMove(event: MouseEvent) {
        if (prefersReducedMotion) return;

        const card = event.currentTarget as HTMLElement;
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to card center (0 to 1)
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // Convert to rotation angles (-15 to 15 degrees)
        // rotateY: left/right tilt based on horizontal position
        // rotateX: up/down tilt based on vertical position (inverted)
        rotateY = (x - 0.5) * 30; // -15 to 15
        rotateX = (0.5 - y) * 30; // -15 to 15

        // Update sheen position (percentage)
        sheenX = x * 100;
        sheenY = y * 100;
    }

    function handleMouseEnter() {
        if (prefersReducedMotion) return;
        isHovering = true;
    }

    function handleMouseLeave() {
        if (prefersReducedMotion) return;
        isHovering = false;
        rotateX = 0;
        rotateY = 0;
        sheenX = 50;
        sheenY = 50;
    }
</script>

<div class="holo-card-container">
    <div
        class="holo-card"
        class:hovering={isHovering}
        class:reduced-motion={prefersReducedMotion}
        style:--rotate-x="{rotateX}deg"
        style:--rotate-y="{rotateY}deg"
        style:--sheen-x="{sheenX}%"
        style:--sheen-y="{sheenY}%"
        onmousemove={handleMouseMove}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
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
        opacity: 0;
        transition: opacity 0.15s ease-out;
        pointer-events: none;
        border-radius: inherit;
    }

    .holo-card.hovering::before {
        opacity: 1;
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
