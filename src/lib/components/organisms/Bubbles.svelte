<script lang="ts">
    // Ambient background with blurred gradient orbs for cinematic depth
    // Subtle floating animation creates bokeh-like city lights effect
</script>

<div class="ambient-background">
    <div class="blob orange"></div>
    <div class="blob purple"></div>
    <div class="blob blue"></div>
</div>

<style>
    .ambient-background {
        position: fixed;
        inset: 0;
        z-index: var(--background-layer);
        overflow: hidden;
        pointer-events: none;
    }

    .blob {
        position: absolute;
        filter: blur(80px);
        opacity: 0.4;
        border-radius: 50%;
    }

    .orange {
        background: var(--color-accent);
        width: 300px;
        height: 300px;
        top: -120px;
        left: 15%;
        opacity: 0.25;
        animation: float-orange 25s ease-in-out infinite;
    }

    .purple {
        background: #6b21a8;
        width: 500px;
        height: 500px;
        top: 20%;
        right: -100px;
        animation: float-purple 30s ease-in-out infinite;
    }

    .blue {
        background: #1e3a8a;
        width: 300px;
        height: 300px;
        bottom: -50px;
        left: -50px;
        animation: float-blue 22s ease-in-out infinite;
    }

    @keyframes float-orange {
        0%,
        100% {
            transform: translate(0, 0);
        }
        33% {
            transform: translate(30px, 15px);
        }
        66% {
            transform: translate(-15px, 25px);
        }
    }

    @keyframes float-purple {
        0%,
        100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-20px, 30px);
        }
        50% {
            transform: translate(-35px, -10px);
        }
        75% {
            transform: translate(10px, -20px);
        }
    }

    @keyframes float-blue {
        0%,
        100% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(25px, -20px);
        }
    }

    /* Respect reduced motion - hide blobs entirely */
    @media (prefers-reduced-motion: reduce) {
        .blob {
            display: none;
        }
    }
</style>
