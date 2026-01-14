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

    // Shine/glitter position follows mouse
    let shineX = $derived(mouseX);
    let shineY = $derived(mouseY);

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
        if (src.sources && src.sources.length > 0) {
            const srcset = src.sources[0].srcset;
            const parts = srcset.split(',');
            if (parts.length > 0) {
                const lastPart = parts[parts.length - 1].trim();
                return lastPart.split(' ')[0];
            }
        }
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
        --bg-image: url('{bgImageUrl}');
    "
>
    <div class="card-perspective">
        <div class="trading-card" class:hovering={isHovering}>
            <div class="card-frame">
                <!-- Layer 1: Image content (bottom) -->
                <div class="card-content">
                    {@render children?.()}
                </div>

                <!-- Layer 2: Glitter sparkles (on top of image) -->
                <div class="card-glitter"></div>

                <!-- Layer 3: Holographic rainbow (on top) -->
                <div class="card-holo"></div>

                <!-- Layer 4: Specular glare (topmost) -->
                <div class="card-glare"></div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .trading-card-container {
        --card-border-width: 10px;
        --card-radius: 20px;

        perspective: 1200px;
        width: fit-content;
    }

    .card-perspective {
        transform-style: preserve-3d;
        transition: transform 0.15s ease-out;
        transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
    }

    .trading-card {
        position: relative;
        border-radius: var(--card-radius);
        transform-style: preserve-3d;
        transition: box-shadow 0.3s ease;

        box-shadow:
            0 15px 35px -10px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(var(--color--primary-rgb), 0.2),
            0 0 20px rgba(var(--color--primary-rgb), 0.1);

        &.hovering {
            box-shadow:
                0 25px 60px -15px rgba(0, 0, 0, 0.6),
                0 0 0 2px rgba(var(--color--primary-rgb), 0.5),
                0 0 50px rgba(var(--color--primary-rgb), 0.4),
                0 0 100px rgba(var(--color--secondary-rgb), 0.2);
        }
    }

    .card-frame {
        position: relative;
        overflow: hidden;
        border-radius: var(--card-radius);
        padding: var(--card-border-width);

        // Animated rainbow border
        background: linear-gradient(
            135deg,
            rgba(var(--color--primary-rgb), 1) 0%,
            rgba(255, 215, 0, 1) 20%,
            rgba(var(--color--secondary-rgb), 1) 40%,
            rgba(180, 100, 255, 1) 60%,
            rgba(var(--color--primary-rgb), 1) 80%,
            rgba(255, 215, 0, 1) 100%
        );
        background-size: 400% 400%;
        animation: borderRainbow 4s linear infinite;
    }

    // The actual image
    .card-content {
        position: relative;
        z-index: 1;
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        overflow: hidden;

        :global(img),
        :global(picture) {
            display: block;
            width: 100%;
            height: auto;
        }
    }

    // Glitter/sparkle overlay - ON TOP of image
    .card-glitter {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 10;
        pointer-events: none;

        // Sparkle pattern using multiple gradient layers
        background-image:
            // White sparkles
            radial-gradient(circle at 20% 30%, white 0px, white 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, white 0px, white 1.5px, transparent 1.5px),
            radial-gradient(circle at 40% 70%, white 0px, white 2px, transparent 2px),
            radial-gradient(circle at 70% 60%, white 0px, white 1px, transparent 1px),
            radial-gradient(circle at 10% 80%, white 0px, white 1.5px, transparent 1.5px),
            radial-gradient(circle at 90% 85%, white 0px, white 2px, transparent 2px),
            radial-gradient(circle at 55% 15%, white 0px, white 1px, transparent 1px),
            radial-gradient(circle at 30% 50%, white 0px, white 1.5px, transparent 1.5px),
            // Cyan sparkles
            radial-gradient(circle at 15% 15%, rgb(var(--color--secondary-rgb)) 0px, rgb(var(--color--secondary-rgb)) 2px, transparent 2px),
            radial-gradient(circle at 85% 45%, rgb(var(--color--secondary-rgb)) 0px, rgb(var(--color--secondary-rgb)) 1.5px, transparent 1.5px),
            radial-gradient(circle at 45% 85%, rgb(var(--color--secondary-rgb)) 0px, rgb(var(--color--secondary-rgb)) 2px, transparent 2px),
            radial-gradient(circle at 65% 35%, rgb(var(--color--secondary-rgb)) 0px, rgb(var(--color--secondary-rgb)) 1px, transparent 1px),
            // Gold sparkles
            radial-gradient(circle at 25% 65%, gold 0px, gold 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, gold 0px, gold 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 40%, gold 0px, gold 1px, transparent 1px),
            radial-gradient(circle at 35% 10%, gold 0px, gold 2px, transparent 2px),
            // Orange sparkles
            radial-gradient(circle at 60% 90%, rgb(var(--color--primary-rgb)) 0px, rgb(var(--color--primary-rgb)) 1.5px, transparent 1.5px),
            radial-gradient(circle at 5% 50%, rgb(var(--color--primary-rgb)) 0px, rgb(var(--color--primary-rgb)) 2px, transparent 2px),
            radial-gradient(circle at 95% 10%, rgb(var(--color--primary-rgb)) 0px, rgb(var(--color--primary-rgb)) 1px, transparent 1px);

        background-size: 100% 100%;
        mix-blend-mode: overlay;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        animation: sparkleFloat 3s ease-in-out infinite;

        .hovering & {
            opacity: 1;
            mix-blend-mode: hard-light;
        }
    }

    // Holographic rainbow overlay
    .card-holo {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 11;
        pointer-events: none;

        background: linear-gradient(
            calc(var(--mouse-x) * 3.6deg + 45deg),
            transparent 0%,
            rgba(255, 0, 100, 0.3) 15%,
            rgba(0, 255, 255, 0.3) 30%,
            rgba(0, 255, 100, 0.3) 45%,
            transparent 50%,
            rgba(255, 255, 0, 0.3) 55%,
            rgba(255, 100, 0, 0.3) 70%,
            rgba(200, 0, 255, 0.3) 85%,
            transparent 100%
        );
        background-size: 200% 200%;
        background-position: calc(var(--mouse-x) * 2%) calc(var(--mouse-y) * 2%);

        mix-blend-mode: color-dodge;
        opacity: 0.4;
        transition: opacity 0.3s ease;
        animation: holoShift 6s ease-in-out infinite;

        .hovering & {
            opacity: 0.8;
        }
    }

    // Specular glare highlight
    .card-glare {
        position: absolute;
        inset: var(--card-border-width);
        border-radius: calc(var(--card-radius) - var(--card-border-width));
        z-index: 12;
        pointer-events: none;

        background: radial-gradient(
            ellipse 50% 50% at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.2) 40%,
            transparent 70%
        );

        opacity: 0.2;
        transition: opacity 0.3s ease;

        .hovering & {
            opacity: 0.7;
        }
    }

    @keyframes borderRainbow {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 400% 50%;
        }
    }

    @keyframes sparkleFloat {
        0%, 100% {
            filter: brightness(1);
            transform: translateY(0);
        }
        50% {
            filter: brightness(1.5);
            transform: translateY(-1px);
        }
    }

    @keyframes holoShift {
        0%, 100% {
            background-position: 0% 0%;
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

    @media (prefers-reduced-motion: reduce) {
        .card-frame,
        .card-glitter,
        .card-holo {
            animation: none;
        }

        .card-perspective {
            transform: none !important;
        }
    }
</style>
