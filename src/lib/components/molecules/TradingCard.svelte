<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { Picture } from 'imagetools-core';

    interface Props {
        children?: Snippet;
        class?: string;
        backgroundSrc?: Picture;
    }

    let { children, class: className = '', backgroundSrc }: Props = $props();

    // Mouse tracking state
    let cardElement: HTMLElement | null = $state(null);
    let mouseX = $state(50);
    let mouseY = $state(50);
    let isHovering = $state(false);

    // Calculate rotation based on mouse position
    let rotateX = $derived(isHovering ? (mouseY - 50) / 4 : 0);
    let rotateY = $derived(isHovering ? (50 - mouseX) / 4 : 0);

    // Shine/glitter position follows mouse with offset for parallax
    let shineX = $derived(mouseX);
    let shineY = $derived(mouseY);

    // Seed for sparkle variation
    let seedX = $derived(Math.floor(mouseX / 5) * 5);
    let seedY = $derived(Math.floor(mouseY / 5) * 5);

    function handleMouseMove(event: MouseEvent) {
        if (!cardElement) return;

        const rect = cardElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        mouseX = (x / rect.width) * 100;
        mouseY = (y / rect.height) * 100;
    }

    function handleMouseEnter() {
        isHovering = true;
    }

    function handleMouseLeave() {
        isHovering = false;
        mouseX = 50;
        mouseY = 50;
    }

    // Get the best quality image URL from the Picture object
    function getImageUrl(src: Picture | undefined): string {
        if (!src) return '';
        // Get the first source's largest image
        if (src.sources && src.sources.length > 0) {
            const srcset = src.sources[0].srcset;
            // Extract the largest image URL from srcset
            const parts = srcset.split(',');
            if (parts.length > 0) {
                const lastPart = parts[parts.length - 1].trim();
                return lastPart.split(' ')[0];
            }
        }
        // Fallback to img.src
        return src.img?.src || '';
    }

    let bgImageUrl = $derived(getImageUrl(backgroundSrc));
</script>

<div
    class="trading-card-container {className}"
    bind:this={cardElement}
    onmousemove={handleMouseMove}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="img"
    style="
        --mouse-x: {shineX}%;
        --mouse-y: {shineY}%;
        --rotate-x: {rotateX}deg;
        --rotate-y: {rotateY}deg;
        --seed-x: {seedX};
        --seed-y: {seedY};
        --bg-image: url('{bgImageUrl}');
    "
>
    <div class="card-perspective">
        <div class="trading-card" class:hovering={isHovering}>
            <!-- VMAX style card frame -->
            <div class="card-frame">
                <!-- Background layer with blurred image -->
                {#if backgroundSrc}
                    <div class="card-background"></div>
                {/if}

                <!-- Glitter/sparkle layer -->
                <div class="card-glitter"></div>

                <!-- Holographic rainbow shine -->
                <div class="card-holo"></div>

                <!-- Specular glare -->
                <div class="card-glare"></div>

                <!-- Foreground content (the actual image) -->
                <div class="card-content">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .trading-card-container {
        --card-border-width: 10px;
        --card-radius: 20px;
        --glitter-size: 2px;
        --glitter-spacing: 24px;

        perspective: 1200px;
        width: fit-content;
    }

    .card-perspective {
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
        transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
    }

    .trading-card {
        position: relative;
        border-radius: var(--card-radius);
        transform-style: preserve-3d;
        transition: box-shadow 0.3s ease;

        // Base shadow with colored glow
        box-shadow:
            0 15px 35px -10px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(var(--color--primary-rgb), 0.2),
            0 0 20px rgba(var(--color--primary-rgb), 0.1),
            0 0 40px rgba(var(--color--secondary-rgb), 0.05);

        &.hovering {
            box-shadow:
                0 25px 60px -15px rgba(0, 0, 0, 0.6),
                0 0 0 2px rgba(var(--color--primary-rgb), 0.4),
                0 0 40px rgba(var(--color--primary-rgb), 0.4),
                0 0 80px rgba(var(--color--secondary-rgb), 0.2),
                0 0 120px rgba(255, 215, 0, 0.1);
        }
    }

    .card-frame {
        position: relative;
        overflow: hidden;
        border-radius: var(--card-radius);
        padding: var(--card-border-width);

        // Animated holographic border - VMAX style rainbow
        background: linear-gradient(
            var(--border-angle, 135deg),
            rgba(var(--color--primary-rgb), 1) 0%,
            rgba(255, 215, 0, 0.9) 15%,
            rgba(var(--color--secondary-rgb), 1) 30%,
            rgba(180, 100, 255, 0.9) 45%,
            rgba(var(--color--primary-rgb), 1) 60%,
            rgba(255, 215, 0, 0.9) 75%,
            rgba(var(--color--secondary-rgb), 1) 90%,
            rgba(var(--color--primary-rgb), 1) 100%
        );
        background-size: 300% 300%;
        animation: borderRainbow 6s linear infinite;
    }

    // Blurred background image layer
    .card-background {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 1;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            inset: -20%;
            background-image: var(--bg-image);
            background-size: 140%;
            background-position: center;
            filter: blur(20px) saturate(1.5) brightness(0.7);
        }
    }

    // Glitter/sparkle effect layer
    .card-glitter {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 2;
        pointer-events: none;
        overflow: hidden;

        // Multi-layer sparkle pattern
        background:
            // Animated sparkle dots - layer 1
            repeating-radial-gradient(
                circle at calc(var(--mouse-x) * 0.5 + 25%) calc(var(--mouse-y) * 0.5 + 25%),
                rgba(255, 255, 255, 0.9) 0px,
                rgba(255, 255, 255, 0.9) var(--glitter-size),
                transparent var(--glitter-size),
                transparent var(--glitter-spacing)
            ),
            // Sparkle dots - layer 2 (offset)
            repeating-radial-gradient(
                circle at calc(var(--mouse-x) * 0.3 + 50%) calc(var(--mouse-y) * 0.3 + 50%),
                rgba(var(--color--secondary-rgb), 1) 0px,
                rgba(var(--color--secondary-rgb), 1) calc(var(--glitter-size) * 0.8),
                transparent calc(var(--glitter-size) * 0.8),
                transparent calc(var(--glitter-spacing) * 1.3)
            ),
            // Sparkle dots - layer 3 (gold)
            repeating-radial-gradient(
                circle at calc(100% - var(--mouse-x) * 0.4) calc(100% - var(--mouse-y) * 0.4),
                rgba(255, 215, 0, 1) 0px,
                rgba(255, 215, 0, 1) calc(var(--glitter-size) * 0.6),
                transparent calc(var(--glitter-size) * 0.6),
                transparent calc(var(--glitter-spacing) * 0.9)
            ),
            // Sparkle dots - layer 4 (primary color)
            repeating-radial-gradient(
                circle at calc(var(--mouse-x) * 0.6 + 10%) calc(var(--mouse-y) * 0.6 + 10%),
                rgba(var(--color--primary-rgb), 1) 0px,
                rgba(var(--color--primary-rgb), 1) calc(var(--glitter-size) * 0.7),
                transparent calc(var(--glitter-size) * 0.7),
                transparent calc(var(--glitter-spacing) * 1.1)
            );

        mix-blend-mode: screen;
        opacity: 0.6;
        transition: opacity 0.4s ease;
        animation: glitterShimmer 3s ease-in-out infinite;

        .hovering & {
            opacity: 1;
        }
    }

    // Holographic rainbow effect
    .card-holo {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 3;
        pointer-events: none;

        // Rainbow gradient that shifts with mouse
        background: linear-gradient(
            calc(var(--mouse-x) * 3.6deg),
            transparent 0%,
            rgba(255, 0, 128, 0.2) 10%,
            rgba(var(--color--secondary-rgb), 0.25) 20%,
            rgba(0, 255, 128, 0.2) 30%,
            transparent 40%,
            rgba(255, 215, 0, 0.2) 50%,
            transparent 60%,
            rgba(var(--color--primary-rgb), 0.25) 70%,
            rgba(180, 100, 255, 0.2) 80%,
            transparent 90%,
            rgba(var(--color--secondary-rgb), 0.2) 100%
        );
        background-size: 200% 200%;
        background-position: calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%);

        mix-blend-mode: color-dodge;
        opacity: 0.5;
        transition: opacity 0.3s ease;
        animation: holoShift 8s ease-in-out infinite;

        .hovering & {
            opacity: 1;
        }
    }

    // Specular glare highlight
    .card-glare {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 4;
        pointer-events: none;

        background:
            // Main glare spot
            radial-gradient(
                ellipse 60% 40% at var(--mouse-x) var(--mouse-y),
                rgba(255, 255, 255, 0.4) 0%,
                rgba(255, 255, 255, 0.15) 30%,
                transparent 70%
            ),
            // Secondary softer glow
            radial-gradient(
                ellipse 100% 80% at var(--mouse-x) var(--mouse-y),
                rgba(255, 255, 255, 0.15) 0%,
                transparent 50%
            );

        opacity: 0.3;
        transition: opacity 0.3s ease;

        .hovering & {
            opacity: 1;
        }
    }

    // Foreground content
    .card-content {
        position: relative;
        z-index: 5;
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        overflow: hidden;
        background: transparent;

        :global(img),
        :global(picture) {
            display: block;
            width: 100%;
            height: auto;
            // Slight mask to blend edges with glitter background
            mask-image: radial-gradient(
                ellipse 95% 95% at center,
                black 70%,
                rgba(0, 0, 0, 0.95) 85%,
                rgba(0, 0, 0, 0.8) 100%
            );
            -webkit-mask-image: radial-gradient(
                ellipse 95% 95% at center,
                black 70%,
                rgba(0, 0, 0, 0.95) 85%,
                rgba(0, 0, 0, 0.8) 100%
            );
        }
    }

    @keyframes borderRainbow {
        0% {
            background-position: 0% 50%;
            --border-angle: 0deg;
        }
        50% {
            background-position: 100% 50%;
            --border-angle: 180deg;
        }
        100% {
            background-position: 0% 50%;
            --border-angle: 360deg;
        }
    }

    @keyframes glitterShimmer {
        0%, 100% {
            filter: brightness(1) contrast(1);
        }
        50% {
            filter: brightness(1.3) contrast(1.15);
        }
    }

    @keyframes holoShift {
        0%, 100% {
            background-position: 0% 50%;
        }
        25% {
            background-position: 100% 0%;
        }
        50% {
            background-position: 100% 100%;
        }
        75% {
            background-position: 0% 100%;
        }
    }

    // Reduce motion for accessibility
    @media (prefers-reduced-motion: reduce) {
        .card-frame {
            animation: none;
            background-size: 100% 100%;
        }

        .card-perspective {
            transform: none !important;
        }

        .card-glitter,
        .card-holo {
            animation: none;
        }

        .card-holo,
        .card-glare,
        .card-glitter {
            opacity: 0.3;
        }
    }
</style>
