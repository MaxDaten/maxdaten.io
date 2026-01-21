<script lang="ts">
    // Ambient background with blurred gradient orbs for cinematic depth
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
    }

    .purple {
        background: #6b21a8;
        width: 500px;
        height: 500px;
        top: 20%;
        right: -100px;
    }

    .blue {
        background: #1e3a8a;
        width: 300px;
        height: 300px;
        bottom: -50px;
        left: -50px;
    }

    /* Respect reduced motion - hide blobs entirely */
    @media (prefers-reduced-motion: reduce) {
        .blob {
            display: none;
        }
    }
</style>
