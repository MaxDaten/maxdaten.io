<script lang="ts">
    import type { Snippet } from 'svelte';
    import { spring } from 'svelte/motion';
    import { MediaQuery } from 'svelte/reactivity';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    // Spring settings from poke-holo for smooth physics-based animation
    const springInteract = { stiffness: 0.066, damping: 0.25 };
    const springSnap = { stiffness: 0.01, damping: 0.06 };

    // Spring stores for rotation and sheen
    const springRotate = spring({ x: 0, y: 0 }, springInteract);
    const springSheen = spring({ x: 50, y: 50 }, springInteract);

    let isHovering = $state(false);
    let animationFrame = $state<number | null>(null);

    // Check for reduced motion preference
    const reducedMotionQuery = new MediaQuery(
        'prefers-reduced-motion: reduce',
        false
    );
    let prefersReducedMotion = $derived(reducedMotionQuery.current);

    // Derived values from springs for use in template
    let rotateX = $derived($springRotate.x);
    let rotateY = $derived($springRotate.y);
    let sheenX = $derived($springSheen.x);
    let sheenY = $derived($springSheen.y);

    function handleMouseMove(event: MouseEvent) {
        if (prefersReducedMotion) return;

        // Throttle with requestAnimationFrame
        if (animationFrame) return;

        // Capture values BEFORE entering rAF callback (event gets recycled)
        const card = event.currentTarget as HTMLElement;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;

        animationFrame = requestAnimationFrame(() => {
            // Calculate position relative to center (-0.5 to 0.5)
            const centerX = (clientX - rect.left) / rect.width - 0.5;
            const centerY = (clientY - rect.top) / rect.height - 0.5;

            // Use interaction spring settings
            springRotate.stiffness = springInteract.stiffness;
            springRotate.damping = springInteract.damping;
            springSheen.stiffness = springInteract.stiffness;
            springSheen.damping = springInteract.damping;

            // Update rotation (~±14° like poke-holo: center / 3.5)
            springRotate.set({
                x: -(centerY * 28), // Inverted Y for natural tilt
                y: centerX * 28,
            });

            // Update sheen position (percentage)
            springSheen.set({
                x: (centerX + 0.5) * 100,
                y: (centerY + 0.5) * 100,
            });

            animationFrame = null;
        });
    }

    function handleMouseEnter() {
        if (prefersReducedMotion) return;
        isHovering = true;

        // Use interaction spring settings
        springRotate.stiffness = springInteract.stiffness;
        springRotate.damping = springInteract.damping;
    }

    function handleMouseLeave() {
        if (prefersReducedMotion) return;
        isHovering = false;

        // Cancel any pending animation frame
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        // Use slower snap-back spring settings
        springRotate.stiffness = springSnap.stiffness;
        springRotate.damping = springSnap.damping;
        springSheen.stiffness = springSnap.stiffness;
        springSheen.damping = springSnap.damping;

        // Snap back to center
        springRotate.set({ x: 0, y: 0 });
        springSheen.set({ x: 50, y: 50 });
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
        /* Spring animation handled by Svelte spring() - no CSS transition needed */
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
        transition: opacity 0.3s ease-out;
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
