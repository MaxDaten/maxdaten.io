<svelte:options css="injected" />

<script lang="ts">
    type Props = {
        badge?: string;
        avatarUrl?: string;
    };

    let { badge = 'Available for 2026', avatarUrl }: Props = $props();
</script>

<div class="wrapper">
    <!-- Ambient Blobs - Warm top-left, Cool bottom-right -->
    <div class="blob orange"></div>
    <div class="blob purple"></div>

    <!-- Content Container -->
    <div class="container">
        <!-- Left Text Column -->
        <div class="text-col">
            <div class="brand">maxdaten.io</div>
            <div class="badge">{badge}</div>
            <h1>
                <span class="line">Products that ship.</span>
                <span class="line highlight">Systems that scale.</span>
            </h1>
            <p class="sub">
                Full-stack product engineering with knowledge transfer built in.
            </p>
        </div>

        <!-- Right Card (Static Trading Card) -->
        <div class="card">
            <div class="card-header">
                <span>MAXDATEN.IO</span>
                <span class="lvl">LVL 99</span>
            </div>
            {#if avatarUrl}
                <img src={avatarUrl} alt="Avatar" class="avatar" />
            {/if}
            <div class="card-name">Jan-Philip</div>
            <div class="card-role">Technical Product Advisor</div>
        </div>
    </div>
</div>

<style>
    /* Satori-safe CSS: Flexbox only, no CSS variables, no z-index */
    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        background-color: #0b0c10;
        font-family: 'Inter', sans-serif;
        position: relative;
        align-items: center;
        justify-content: center;
    }

    /* Ambient blobs - separated warm/cool light sources */
    .blob {
        display: flex;
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.25;
    }
    .blob.orange {
        background-color: #ff8000;
        top: -250px;
        left: -150px;
        opacity: 0.2;
    }
    .blob.purple {
        background-color: #7c3aed;
        bottom: -200px;
        right: -150px;
    }

    .container {
        display: flex;
        width: 100%;
        padding: 60px;
        justify-content: space-between;
        align-items: center;
    }

    .text-col {
        display: flex;
        flex-direction: column;
        width: 680px;
    }

    .brand {
        display: flex;
        color: #ffffff;
        opacity: 0.9;
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        letter-spacing: -0.02em;
        margin-bottom: 24px;
    }

    .badge {
        display: flex;
        padding: 8px 16px;
        border: 1px solid #ff8000;
        color: #ff8000;
        border-radius: 50px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
        background-color: rgba(255, 128, 0, 0.1);
        align-self: flex-start;
        margin-bottom: 32px;
    }

    h1 {
        display: flex;
        flex-direction: column;
        font-size: 60px;
        line-height: 1.15;
        letter-spacing: -0.03em;
        color: white;
        margin: 0 0 24px 0;
        font-weight: 700;
    }

    .line {
        display: flex;
    }

    .highlight {
        display: flex;
        color: #ff8000;
    }

    .sub {
        display: flex;
        font-size: 26px;
        color: #d1d5db;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
    }

    /* Trading Card - Physical object feel */
    .card {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 320px;
        height: 440px;
        background-color: #23252b;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 16px;
        box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.9),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 600;
        color: #9ca3af;
        margin-bottom: 12px;
    }

    .lvl {
        display: flex;
        color: #ff8000;
    }

    .avatar {
        width: 286px;
        height: 280px;
        object-fit: cover;
        border-radius: 12px;
        border: 1px solid #333;
        margin-bottom: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    .card-name {
        display: flex;
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-transform: uppercase;
    }

    .card-role {
        display: flex;
        font-size: 14px;
        color: #ff8000;
        font-family: 'JetBrains Mono', monospace;
    }
</style>
