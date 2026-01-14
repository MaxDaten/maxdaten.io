<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children?: Snippet;
        class?: string;
    }

    let { children, class: className = '' }: Props = $props();

    // Mouse tracking state
    let cardElement: HTMLElement | null = $state(null);
    let mouseX = $state(50);
    let mouseY = $state(50);
    let isHovering = $state(false);

    // Calculate rotation based on mouse position
    let rotateX = $derived(isHovering ? (mouseY - 50) / 5 : 0);
    let rotateY = $derived(isHovering ? (50 - mouseX) / 5 : 0);

    // Shine position follows mouse
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
    "
>
    <div class="card-perspective">
        <div class="trading-card" class:hovering={isHovering}>
            <!-- Card frame border -->
            <div class="card-frame">
                <!-- Holographic shine overlay -->
                <div class="card-shine"></div>

                <!-- Glare effect -->
                <div class="card-glare"></div>

                <!-- Content wrapper -->
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
        --card-border-width: 8px;
        --card-radius: 16px;
        --shine-intensity: 0.4;
        --glare-intensity: 0.15;

        perspective: 1000px;
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
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;

        // Base shadow
        box-shadow:
            0 10px 30px -10px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(var(--color--primary-rgb), 0.1);

        &.hovering {
            box-shadow:
                0 20px 50px -15px rgba(0, 0, 0, 0.6),
                0 0 30px rgba(var(--color--primary-rgb), 0.3),
                0 0 60px rgba(var(--color--secondary-rgb), 0.15);
        }
    }

    .card-frame {
        position: relative;
        overflow: hidden;
        border-radius: var(--card-radius);
        padding: var(--card-border-width);

        // Holographic border gradient
        background: linear-gradient(
            135deg,
            rgba(var(--color--primary-rgb), 0.8) 0%,
            rgba(var(--color--secondary-rgb), 0.6) 25%,
            rgba(var(--color--primary-rgb), 0.7) 50%,
            rgba(var(--color--secondary-rgb), 0.8) 75%,
            rgba(var(--color--primary-rgb), 0.6) 100%
        );
        background-size: 400% 400%;
        animation: borderShimmer 8s ease infinite;
    }

    .card-shine {
        position: absolute;
        inset: 0;
        border-radius: var(--card-radius);
        pointer-events: none;
        z-index: 3;

        // Holographic rainbow gradient that follows mouse
        background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.3) 0%,
            transparent 50%
        ),
        linear-gradient(
            125deg,
            transparent 0%,
            rgba(var(--color--secondary-rgb), var(--shine-intensity)) 20%,
            transparent 30%,
            rgba(255, 215, 0, var(--shine-intensity)) 45%,
            transparent 55%,
            rgba(var(--color--primary-rgb), var(--shine-intensity)) 70%,
            transparent 80%,
            rgba(var(--color--secondary-rgb), var(--shine-intensity)) 95%,
            transparent 100%
        );
        background-size: 100% 100%, 300% 300%;
        background-position:
            0% 0%,
            calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%);
        mix-blend-mode: color-dodge;
        opacity: 0;
        transition: opacity 0.3s ease;

        .hovering & {
            opacity: 1;
        }
    }

    .card-glare {
        position: absolute;
        inset: 0;
        border-radius: var(--card-radius);
        pointer-events: none;
        z-index: 4;

        // Specular highlight that follows cursor
        background: radial-gradient(
            ellipse 80% 50% at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, var(--glare-intensity)) 0%,
            transparent 60%
        );
        opacity: 0;
        transition: opacity 0.3s ease;

        .hovering & {
            opacity: 1;
        }
    }

    .card-content {
        position: relative;
        z-index: 2;
        border-radius: calc(var(--card-radius) - var(--card-border-width) / 2);
        overflow: hidden;
        background: var(--color--card-background);

        // Inner shadow for depth
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);

        :global(img),
        :global(picture) {
            display: block;
            width: 100%;
            height: auto;
        }
    }

    @keyframes borderShimmer {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    // Reduce motion for accessibility
    @media (prefers-reduced-motion: reduce) {
        .card-frame {
            animation: none;
        }

        .card-perspective {
            transform: none !important;
        }

        .card-shine,
        .card-glare {
            display: none;
        }
    }
</style>
