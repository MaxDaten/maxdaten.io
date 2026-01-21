<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Spring, prefersReducedMotion } from 'svelte/motion';
    import { MediaQuery } from 'svelte/reactivity';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    // Spring settings from poke-holo for smooth physics-based animation
    const springInteract = { stiffness: 0.066, damping: 0.25 };
    const springSnap = { stiffness: 0.01, damping: 0.06 };

    // Spring stores for rotation, sheen, and border angle
    const springRotate = Spring.of(() => ({ x: 0, y: 0 }), springInteract);
    const springSheen = Spring.of(() => ({ x: 50, y: 50 }), springInteract);
    const springAngle = Spring.of(() => 0, springInteract);

    let isHovering = $state(false);
    let animationFrame = $state<number | null>(null);

    // Check for mobile viewport (tablet-portrait-down breakpoint)
    const mobileQuery = new MediaQuery('(max-width: 900px)', false);

    // Static mode: disable animations for reduced motion OR mobile
    let isStaticMode = $derived(
        prefersReducedMotion.current || mobileQuery.current
    );

    // Derived values from springs for use in template
    function handleMouseMove(event: MouseEvent) {
        if (isStaticMode) return;

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
            springAngle.stiffness = springInteract.stiffness;
            springAngle.damping = springInteract.damping;

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

            // Calculate angle pointing from center toward cursor (0deg = top, clockwise)
            const angleRad = Math.atan2(centerX, -centerY);
            const angleDeg = angleRad * (180 / Math.PI);
            springAngle.set(angleDeg);

            animationFrame = null;
        });
    }

    function handleMouseEnter() {
        if (isStaticMode) return;
        isHovering = true;

        // Use interaction spring settings
        springRotate.stiffness = springInteract.stiffness;
        springRotate.damping = springInteract.damping;
    }

    function handleMouseLeave() {
        if (isStaticMode) return;
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
        springAngle.stiffness = springSnap.stiffness;
        springAngle.damping = springSnap.damping;

        // Snap back to center
        springRotate.set({ x: 0, y: 0 });
        springSheen.set({ x: 50, y: 50 });
        springAngle.set(0);
    }
</script>

<div class="holo-card-container">
    <div
        class="holo-card"
        class:hovering={isHovering}
        class:static-mode={isStaticMode}
        style:--rotate-x="{springRotate.current.x}deg"
        style:--rotate-y="{springRotate.current.y}deg"
        style:--sheen-x="{springSheen.current.x}%"
        style:--sheen-y="{springSheen.current.y}%"
        style:--border-angle="{springAngle.current}deg"
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
        background-color: #23252b;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
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

    /* Static mode: reduced motion OR mobile - fixed tilt with visible sheen */
    .holo-card.static-mode {
        transform: rotateX(0deg) rotateY(-7deg);
        transition: none;
    }

    .holo-card.static-mode::before {
        opacity: 1;
        --sheen-x: 35%;
        --sheen-y: 30%;
    }

    /* Edge-based shining border that follows cursor position */
    .holo-card::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
            calc(var(--border-angle, 0deg) + 180deg),
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted)) 0%,
            transparent 50%
        );
        /* Modern mask technique (Baseline 2023) */
        -webkit-mask:
            conic-gradient(#000 0 0) content-box,
            conic-gradient(#000 0 0);
        mask:
            conic-gradient(#000 0 0) content-box exclude,
            conic-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease-out;
        pointer-events: none;
    }

    .holo-card.hovering::after {
        opacity: 1;
    }

    .holo-card.static-mode::after {
        opacity: 1;
        --border-angle: -110deg;
    }
</style>
