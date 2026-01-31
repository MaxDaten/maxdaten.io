<svelte:options css="injected" />

<script lang="ts">
    type Props = {
        badge?: string;
        avatarUrl?: string;
    };

    let { badge = 'Available for 2026', avatarUrl }: Props = $props();
</script>

<div class="wrapper">
    <!-- Single ambient gradient spanning the whole canvas -->
    <div class="ambient-gradient"></div>

    <!-- Content Container -->
    <div class="container">
        <!-- Left Text Column -->
        <div class="og_textbox">
            <div class="brand">maxdaten.io</div>
            <div class="badge">{badge}</div>
            <h1>
                <span class="line">Products that ship.</span>
                <span class="line"
                    ><span class="highlight">Systems that scale</span>.</span
                >
            </h1>
            <p class="sub">
                Full-stack product engineering with knowledge transfer built in.
                15+ years spanning product development, platform architecture,
                and technical leadership.
            </p>
        </div>

        <!-- Right Card - Extends beyond frame edge -->
        <div class="card-wrapper">
            <div class="card">
                <div class="card-header">
                    <span>MAXDATEN.IO</span>
                </div>
                {#if avatarUrl}
                    <img src={avatarUrl} alt="Avatar" class="avatar" />
                {/if}
                <div class="card-name">Jan-Philip</div>
                <div class="card-role">Technical Product Advisor</div>
            </div>
        </div>
    </div>

    <!-- Fade overlay for smooth card exit on right edge (last for stacking) -->
    <div class="fade-overlay"></div>
</div>

<style>
    /* Satori-safe CSS: Flexbox only, no CSS variables */
    /* Font fallback: 'Inter Variable' for browser preview, 'Inter' for Satori OG generation */
    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        background-color: #0a0a0c;
        font-family: 'Inter Variable', 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
    }

    /* Single ambient gradient spanning full canvas */
    .ambient-gradient {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* prettier-ignore */
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(255, 128, 0, 0.25));
    }

    /* Wide fade overlay - 600px for imperceptible transition */
    .fade-overlay {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 120px;
        background: linear-gradient(90deg, rgba(10, 10, 12, 0), #0a0a0c);
    }

    .container {
        position: relative;
        display: flex;
        width: 100%;
        padding: 64px 0 64px 72px;
        justify-content: space-between;
        align-items: center;
    }

    .og_textbox {
        display: flex;
        flex-direction: column;
        width: 620px;
    }

    .brand {
        display: flex;
        color: #ffffff;
        opacity: 0.7;
        font-family: 'JetBrains Mono', monospace;
        font-size: 18px;
        letter-spacing: 0.02em;
        margin-bottom: 20px;
    }

    .badge {
        display: flex;
        padding: 14px 28px;
        border: 2px solid #ff8000;
        color: #ff8000;
        border-radius: 50px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 24px;
        font-weight: 500;
        background-color: rgba(255, 128, 0, 0.08);
        align-self: flex-start;
        margin-bottom: 28px;
    }

    h1 {
        display: flex;
        flex-direction: column;
        font-family: 'Inter Variable', 'Inter', sans-serif;
        font-size: 56px;
        line-height: 1.1;
        color: white;
        margin: 0 0 20px 0;
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
        font-size: 22px;
        color: #a1a1aa;
        font-weight: 400;
        line-height: 1.5;
        margin: 0;
    }

    /* Card wrapper - positioned to cut into frame with natural tilt */
    .card-wrapper {
        display: flex;
        position: relative;
        margin-right: -80px;
        transform: rotate(-6deg);
    }

    /* Trading Card - Physical object feel */
    .card {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 420px;
        height: 560px;
        background-color: #18191d;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px;
        box-shadow: 0 50px 70px -20px rgba(0, 0, 0, 0.9);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 600;
        color: #71717a;
        letter-spacing: 0.05em;
        margin-bottom: 16px;
    }

    .avatar {
        width: 370px;
        height: 360px;
        object-fit: cover;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 20px;
        box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.7),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .card-name {
        display: flex;
        font-size: 32px;
        font-weight: 700;
        color: #fafafa;
        text-transform: uppercase;
        letter-spacing: 0.02em;
    }

    .card-role {
        display: flex;
        font-size: 24px;
        color: #ff8000;
        font-family: 'JetBrains Mono', monospace;
        margin-top: 8px;
        letter-spacing: 0.02em;
    }
</style>
