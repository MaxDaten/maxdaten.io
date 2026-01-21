<svelte:options css="injected" />

<script lang="ts">
    import type { Author } from '$utils/types';

    type Props = {
        author: Author;
        profileImageSrc?: string;
    };

    let { author, profileImageSrc }: Props = $props();
</script>

<div class="og-wrapper">
    <!-- Card with perspective illusion -->
    <div class="card-container">
        <!-- Border glow layer (simulates edge-based shine) -->
        <div class="border-glow"></div>

        <!-- Main card -->
        <div class="card">
            <!-- Sheen overlay (simulates HoloCard static mode sheen) -->
            <div class="sheen-overlay"></div>

            <!-- Card content -->
            <div class="content">
                {#if profileImageSrc}
                    <div class="avatar-container">
                        <img src={profileImageSrc} alt="" class="avatar" />
                        <div class="avatar-glow"></div>
                    </div>
                {/if}

                <h1 class="name">{author.name}</h1>
                <p class="tagline">{author.tagline}</p>

                <div class="branding">
                    <span class="site-name">maxdaten.io</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    /* Note: Only Satori-compatible CSS (mainly flexbox) */
    /* No CSS variable support - using hardcoded values */
    @use '$lib/scss/_themes.scss' as *;

    $font-default: 'Inter', sans-serif;
    $font-logo: 'Baloo-2', sans-serif;

    /* Colors from theme/HoloCard */
    $bg-page: #1c1e26;
    $bg-card: #23252b;
    $accent: #ff8000;
    $accent-warm: #ffb347;
    $text-primary: #fffcfc;
    $text-muted: #d9f9fd;

    .og-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            ellipse at 30% 40%,
            rgba($accent, 0.08) 0%,
            $bg-page 50%,
            #141519 100%
        );
        font-family: $font-default;
    }

    .card-container {
        display: flex;
        position: relative;
        width: 480px;
        height: 540px;
    }

    /* Border glow effect - simulates the edge-based shine */
    .border-glow {
        display: flex;
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border-radius: 20px;
        background: linear-gradient(
            -110deg,
            rgba($accent, 0.6) 0%,
            rgba($accent, 0.2) 30%,
            transparent 60%
        );
    }

    .card {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: $bg-card;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Sheen overlay - simulates HoloCard static mode sheen at 35% x, 30% y */
    .sheen-overlay {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at 35% 30%,
            rgba($accent, 0.3) 0%,
            rgba($accent, 0.1) 25%,
            rgba($accent, 0.05) 50%,
            transparent 70%
        );
        border-radius: 16px;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: 40px;
        gap: 24px;
        z-index: 1;
    }

    .avatar-container {
        display: flex;
        position: relative;
        width: 180px;
        height: 180px;
    }

    .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba($accent, 0.5);
    }

    /* Glow behind avatar */
    .avatar-glow {
        display: flex;
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba($accent, 0.3) 0%,
            rgba($accent, 0.1) 50%,
            transparent 70%
        );
        z-index: -1;
    }

    .name {
        font-size: 3.5rem;
        font-weight: 700;
        line-height: 1.1;
        color: $text-primary;
        margin: 0;
        text-align: center;
        text-shadow: 0 0 30px rgba($accent, 0.3);
    }

    .tagline {
        font-size: 2rem;
        font-weight: 500;
        color: $accent;
        font-style: italic;
        margin: 0;
        text-align: center;
    }

    .branding {
        display: flex;
        position: absolute;
        bottom: 24px;
        right: 24px;
    }

    .site-name {
        font-family: $font-logo;
        font-size: 2.5rem;
        font-weight: 800;
        color: $accent;
        text-shadow: 0 0 20px rgba($accent, 0.4);
    }
</style>
