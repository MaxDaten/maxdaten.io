<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Spring, prefersReducedMotion } from 'svelte/motion';
    import { MediaQuery } from 'svelte/reactivity';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();

    // Physics configuration
    const springInteract = { stiffness: 0.066, damping: 0.25 };
    const springSnap = { stiffness: 0.01, damping: 0.06 };

    // 1. ROTATION: Physical tilt of the card
    const springRotate = Spring.of(() => ({ x: 0, y: 0 }), springInteract);

    // 2. GLARE: The white spotlight (follows mouse directly)
    const springGlare = Spring.of(
        () => ({ x: 50, y: 50, o: 0 }),
        springInteract
    );

    // 3. HOLO BACKGROUND: Moves OPPOSITE to mouse to simulate depth/refraction
    const springBackground = Spring.of(
        () => ({ x: 50, y: 50 }),
        springInteract
    );

    // 4. PATTERN: Moves slowly for parallax depth effect
    const springPattern = Spring.of(() => ({ x: 50, y: 50 }), springInteract);

    // 5. BORDER ANGLE: Points from center toward cursor for sheen border
    const springAngle = Spring.of(() => 0, springInteract);

    // 6. TRANSLATE: Compensates for perspective skew, animates to 0 at max tilt
    const springTranslate = Spring.of(() => -1.5, springInteract);

    let isHovering = $state(false);
    let animationFrame = $state<number | null>(null);
    const mobileQuery = new MediaQuery('(max-width: 900px)', false);

    // Separate concerns for clearer logic
    let isMobile = $derived(mobileQuery.current);
    let isReducedMotion = $derived(prefersReducedMotion.current);

    // Static mode: only when user prefers reduced motion
    let isStaticMode = $derived(isReducedMotion);

    // Scroll mode: mobile without reduced motion preference
    let isScrollMode = $derived(isMobile && !isReducedMotion);

    // Reference to the card element for scroll calculations
    let sceneElement = $state<HTMLElement | null>(null);

    // Scroll-based tilt for mobile (when motion allowed)
    $effect(() => {
        if (!isScrollMode) return;

        function handleScroll() {
            if (!sceneElement) return;

            // Use scroll position: 0 at top of page, increases as user scrolls down
            const maxScroll = 400; // Full tilt range over 400px of scroll
            const scrollProgress = Math.min(window.scrollY / maxScroll, 1);

            // Map progress to tilt: -10deg (not scrolled) to +10deg (scrolled)
            const tiltY = -10 + scrollProgress * 20;

            // Border angle follows tilt direction (roughly 10x tiltY)
            const borderAngle = tiltY * 10;

            // Animate holo background based on scroll (subtle movement)
            const bgX = 50 + (scrollProgress - 0.5) * 20;
            const bgY = 50 + (scrollProgress - 0.5) * 15;

            // Pattern parallax (slower movement for depth)
            const ptX = 50 + (scrollProgress - 0.5) * 5;
            const ptY = 50 + (scrollProgress - 0.5) * 4;

            // Glare follows scroll position (subtle)
            const glareX = 40 + scrollProgress * 20;
            const glareY = 35 + scrollProgress * 15;

            // Translate: -1.5% at top, 0% at max scroll
            const translateX = -1.5 + scrollProgress * 1.5;

            setSpringConfig(springSnap);
            springRotate.set({ x: 0, y: tiltY });
            springAngle.set(borderAngle);
            springBackground.set({ x: bgX, y: bgY });
            springPattern.set({ x: ptX, y: ptY });
            springGlare.set({ x: glareX, y: glareY, o: 0.2 });
            springTranslate.set(translateX);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // Calculate tilt intensity (0 to 1) based on rotation magnitude
    // Max tilt is 28° per axis, so max magnitude ≈ 40° (diagonal)
    const MAX_TILT = 40;
    let tiltIntensity = $derived.by(() => {
        const { x, y } = springRotate.current;
        const magnitude = Math.sqrt(x * x + y * y);
        return Math.min(magnitude / MAX_TILT, 1);
    });

    function handleMouseMove(event: MouseEvent) {
        if (isStaticMode || isScrollMode || animationFrame) return;

        const card = event.currentTarget as HTMLElement;
        const rect = card.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;

        animationFrame = requestAnimationFrame(() => {
            // 0 to 1 relative to card
            const xPct = (clientX - rect.left) / rect.width;
            const yPct = (clientY - rect.top) / rect.height;

            // -0.5 to 0.5 for rotation math
            const centerX = xPct - 0.5;
            const centerY = yPct - 0.5;

            // Apply "Active" spring tension
            setSpringConfig(springInteract);

            // 1. Tilt
            springRotate.set({
                x: -(centerY * 28), // Max tilt X
                y: centerX * 28, // Max tilt Y
            });

            // 2. Glare (Follows mouse)
            springGlare.set({
                x: xPct * 100,
                y: yPct * 100,
                o: 1, // Visibility
            });

            // 3. Holo Spectrum (Moves FAST for rainbow shimmer)
            springBackground.set({
                x: 50 + centerX * 80,
                y: 50 + centerY * 80,
            });

            // 4. Lambda Pattern (Moves SLOW for parallax depth)
            springPattern.set({
                x: 50 + centerX * 10,
                y: 50 + centerY * 10,
            });

            // 5. Border angle (points from center toward cursor)
            const angleRad = Math.atan2(centerX, -centerY);
            const angleDeg = angleRad * (180 / Math.PI);
            springAngle.set(angleDeg);

            animationFrame = null;
        });
    }

    function handleMouseEnter() {
        if (isStaticMode || isScrollMode) return;
        isHovering = true;
        setSpringConfig(springInteract);
    }

    function handleMouseLeave() {
        if (isStaticMode || isScrollMode) return;
        isHovering = false;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        // Snap back gently
        setSpringConfig(springSnap);
        springRotate.set({ x: 0, y: 0 });
        springGlare.set({ x: 50, y: 50, o: 0 });
        springBackground.set({ x: 50, y: 50 });
        springPattern.set({ x: 50, y: 50 });
        springAngle.set(0);
    }

    function setSpringConfig(config: typeof springInteract) {
        springRotate.stiffness = config.stiffness;
        springRotate.damping = config.damping;
        springGlare.stiffness = config.stiffness;
        springGlare.damping = config.damping;
        springBackground.stiffness = config.stiffness;
        springBackground.damping = config.damping;
        springPattern.stiffness = config.stiffness;
        springPattern.damping = config.damping;
        springAngle.stiffness = config.stiffness;
        springAngle.damping = config.damping;
        springTranslate.stiffness = config.stiffness;
        springTranslate.damping = config.damping;
    }
</script>

<div
    class="holo-scene"
    bind:this={sceneElement}
    onmousemove={handleMouseMove}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="presentation"
>
    <div
        class="holo-card"
        class:hovering={isHovering}
        class:static-mode={isStaticMode}
        class:scroll-mode={isScrollMode}
        style:--rotate-x="{springRotate.current.x}deg"
        style:--rotate-y="{springRotate.current.y}deg"
        style:--glare-x="{springGlare.current.x}%"
        style:--glare-y="{springGlare.current.y}%"
        style:--glare-o={springGlare.current.o}
        style:--bg-x="{springBackground.current.x}%"
        style:--bg-y="{springBackground.current.y}%"
        style:--pt-x="{springPattern.current.x}%"
        style:--pt-y="{springPattern.current.y}%"
        style:--tilt={tiltIntensity}
        style:--border-angle="{springAngle.current}deg"
        style:--translate-x="{springTranslate.current}%"
    >
        <!-- 1. The Content (Base Layer) -->
        <div class="card-content">
            {@render children()}
        </div>

        <!-- 2. The Holographic Foil (Texture + Spectrum) -->
        <!-- This sits ABOVE content but uses blend modes to interact -->
        <div class="holo-layer"></div>

        <!-- 3. The Glare (White Reflection) -->
        <div class="glare-layer"></div>

        <!-- 4. The Edge Highlight -->
        <div class="border-glow"></div>
    </div>
</div>

<style>
    /* --- Layout --- */
    .holo-scene {
        perspective: 1000px;
        /* Ensure the scene fits the card content */
        display: inline-block;
        /* Static wrapper receives all mouse events - prevents Z-fighting flicker */
        position: relative;
        border-radius: var(--radius-card, 24px);
    }

    .holo-card {
        position: relative;
        /* Fill the static scene wrapper */
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
        border-radius: var(--radius-card, 24px);
        background-color: #23252b; /* Dark Slate Base */
        /* Printed border ~0.3cm (11px) - inset */
        box-shadow: inset 0 0 0 11px rgba(255, 128, 0, 0.1);

        /* Important: Holo effects need overflow hidden to stay inside borders */
        /* But if you want 3D popping elements, move them outside this container */
        overflow: hidden;

        /* Hardware acceleration hints */
        will-change: transform;

        /* Fix 3D clipping bleed at corners */
        isolation: isolate;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        mask-image: radial-gradient(white, black);
    }

    /* --- Content Layer --- */
    .card-content {
        position: relative;
        z-index: 1; /* Above holo foil for 100% readable text */
        background: transparent;
        padding: var(--raw-space-24);
    }

    /* --- The Amazing Rare Holo Layer --- */
    .holo-layer {
        position: absolute;
        inset: 0;
        z-index: 2; /* Behind text (z-10), above background */
        border-radius: inherit;
        pointer-events: none;

        /* Hidden by default for clean dark matte look */
        opacity: 0.1;

        /* BLENDING IS KEY: Color-dodge makes it shine on highlights, hidden on blacks */
        mix-blend-mode: color-dodge;

        /* VIBRANCE BOOST: No brightness to preserve dark background */
        filter: saturate(1.5);

        /*
           LAYER 1 (Top): The Lambda Texture
           Brighter stroke to catch color-dodge strongly.
        */
        --pattern-lambda: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 20L10.5 6L8.5 2 M10.5 6L17 20' stroke='rgba(255,255,255,0.4)' stroke-width='2' fill='none' stroke-linecap='square'/%3E%3C/svg%3E");

        /*
           LAYER 2 (Bottom): The Iridescent Spectrum
           Lighter, neon colors - darker colors get eaten by color-dodge.
           Tighter bands create "oil slick" effect.
        */
        --gradient-spectrum: linear-gradient(
            115deg,
            transparent 25%,
            oklch(0.774 0.163 60.276) 40%,
            oklch(0.709 0.159 293.541) 50%,
            oklch(0.797 0.134 211.502) 60%,
            transparent 75%
        );

        background-image: var(--pattern-lambda), var(--gradient-spectrum);

        /*
           SIZE:
           - Pattern: 20px (tiny texture)
           - Spectrum: 250% (tighter wash for more visible bands)
        */
        background-size:
            17px 17px,
            350% 350%;

        /*
           POSITION:
           - Pattern: Slow parallax (--pt-x/y)
           - Spectrum: Fast movement (--bg-x/y)
        */
        background-position:
            var(--pt-x, 50%) var(--pt-y, 50%),
            var(--bg-x) var(--bg-y);

        background-blend-mode: overlay;
        transition: opacity 0.3s ease;
    }

    /* --- The Glare Layer (White washout) --- */
    .glare-layer {
        position: absolute;
        inset: 0;
        z-index: 3; /* On top of everything for surface reflection */
        pointer-events: none;

        /* A radial beam of light */
        background: radial-gradient(
            farthest-corner circle at var(--glare-x) var(--glare-y),
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 60%
        );

        mix-blend-mode: overlay;
        opacity: var(--glare-o);
        transition: opacity 0.1s;
    }

    /* --- Border Glow --- */
    .border-glow {
        position: absolute;
        inset: 0;
        z-index: 4;
        border-radius: inherit;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 0 15px rgba(255, 128, 0, 0.1); /* Subtle internal ambient */
        pointer-events: none;
    }

    /* --- Sheen Border (follows cursor angle) --- */
    .holo-card::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 5;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
            var(--border-angle, 0deg),
            rgba(255, 128, 0, 0.25) 0%,
            transparent 50%
        );
        /* Mask technique to show only the border */
        -webkit-mask:
            conic-gradient(#000 0 0) content-box,
            conic-gradient(#000 0 0);
        mask:
            conic-gradient(#000 0 0) content-box,
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

    /* Reveal holo foil on hover - 0.5 is plenty visible with color-dodge */
    .holo-card.hovering .holo-layer {
        opacity: 0.25;
    }

    .holo-card.static-mode::after {
        opacity: 1;
        --border-angle: -70deg; /* Light from right when tilted left */
    }

    /* --- Static / Mobile Mode --- */
    .holo-card.static-mode {
        transform: rotateX(0deg) rotateY(-7deg);
        translate: -1.5%; /* Moves card center to compensate for perspective skew */
    }

    .holo-card.static-mode .holo-layer {
        opacity: 0.1; /* Balanced holo effect on mobile */
        background-position:
            center center,
            30% 30%;
        transition: opacity 0.5s ease;
    }

    .holo-card.static-mode .glare-layer {
        display: none;
    }

    /* --- Scroll Mode (Mobile with motion) --- */
    .holo-card.scroll-mode {
        /* Translate animates from -1.5% to 0% as user scrolls to max tilt */
        translate: var(--translate-x, -1.5%);
    }

    .holo-card.scroll-mode .holo-layer {
        opacity: 0.15;
    }

    .holo-card.scroll-mode::after {
        opacity: 1;
        /* Border angle follows tilt via spring */
    }
</style>
