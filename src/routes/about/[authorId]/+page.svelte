<script lang="ts">
    import type { PageData } from './$types';
    import { getAuthorAvatar } from '$lib/utils/image-loader';
    import { onMount } from 'svelte';

    export let data: PageData;

    const { author } = data;

    // Mock stats for the trading card - these could be made dynamic later
    const stats = {
        kubernetes: 95,
        cloud: 90,
        functional: 85,
        devops: 98,
        automation: 95,
        architecture: 88,
    };

    const abilities = [
        {
            id: 1,
            name: 'Nix Mastery',
            description: 'Reproducible environments +50 reliability',
        },
        {
            id: 2,
            name: 'WIP Limiter',
            description: 'Team productivity boost +40%',
        },
        {
            id: 3,
            name: 'Infrastructure as Code',
            description: 'Deployment speed +75%',
        },
        {
            id: 4,
            name: 'Functional Thinking',
            description: 'Bug resistance +60%',
        },
    ];

    // Get optimized author image
    const authorImage = getAuthorAvatar(author.id);

    // Reverse Holo effect variables
    let cardElement: HTMLElement;
    let _pointerX = 0;
    let _pointerY = 0;
    let pointerFromLeft = 0;
    let pointerFromTop = 0;
    let pointerFromCenter = 0;
    let cardOpacity = 0;

    onMount(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardElement) return;

            const rect = cardElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            _pointerX = x;
            _pointerY = y;
            pointerFromLeft = x / rect.width;
            pointerFromTop = y / rect.height;

            // Calculate distance from center (0 = center, 1 = edge)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceFromCenter =
                Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) /
                Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));

            pointerFromCenter = Math.min(distanceFromCenter, 1);
            cardOpacity = 1 - pointerFromCenter * 0.5;

            // Update CSS custom properties
            cardElement.style.setProperty('--pointer-x', `${x}px`);
            cardElement.style.setProperty('--pointer-y', `${y}px`);
            cardElement.style.setProperty(
                '--pointer-from-left',
                pointerFromLeft.toString()
            );
            cardElement.style.setProperty(
                '--pointer-from-top',
                pointerFromTop.toString()
            );
            cardElement.style.setProperty(
                '--pointer-from-center',
                pointerFromCenter.toString()
            );
            cardElement.style.setProperty(
                '--card-opacity',
                cardOpacity.toString()
            );
        };

        const handleMouseEnter = () => {
            cardOpacity = 1;
        };

        const handleMouseLeave = () => {
            cardOpacity = 0;
            if (cardElement) {
                cardElement.style.setProperty('--card-opacity', '0');
            }
        };

        if (cardElement) {
            cardElement.addEventListener('mousemove', handleMouseMove);
            cardElement.addEventListener('mouseenter', handleMouseEnter);
            cardElement.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (cardElement) {
                cardElement.removeEventListener('mousemove', handleMouseMove);
                cardElement.removeEventListener('mouseenter', handleMouseEnter);
                cardElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    });
</script>

<svelte:head>
    <title>{author.name} - Trading Card | maxdaten.io</title>
    <meta
        name="description"
        content="Trading card for {author.name} - {author.tagline}"
    />
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="card-container">
    <div class="trading-card" bind:this={cardElement}>
        <!-- Header Section -->
        <div class="card-header">
            <h1 class="name">{author.name}</h1>
            <span class="domain">maxdaten.io</span>
            <div class="level-bar">
                <span class="level-text">Master Level DevOps Engineer</span>
                <div class="xp-bar">
                    <div class="xp-fill"></div>
                </div>
            </div>
        </div>

        <!-- Avatar Section -->
        <div class="avatar-section">
            <div class="hex-frame">
                {#if authorImage}
                    <img
                        src={authorImage.img.src}
                        alt={author.name}
                        class="avatar"
                    />
                {:else}
                    <div class="avatar-placeholder">
                        <span class="avatar-initials"
                            >{author.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}</span
                        >
                    </div>
                {/if}
                <div class="hex-overlay"></div>
                <div class="glow-effect"></div>
            </div>
        </div>

        <!-- Stats Panel -->
        <div class="stats-panel">
            <h3 class="stats-title">CORE STATS</h3>
            <div class="stat-item">
                <span class="stat-label">Kubernetes</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.kubernetes}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.kubernetes}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Cloud (GCP)</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.cloud}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.cloud}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Functional Prog</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.functional}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.functional}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">DevOps</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.devops}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.devops}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Automation</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.automation}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.automation}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Architecture</span>
                <div class="stat-bar">
                    <div
                        class="stat-fill"
                        style="--stat-value: {stats.architecture}%"
                    ></div>
                </div>
                <span class="stat-value">{stats.architecture}%</span>
            </div>
        </div>

        <!-- Special Abilities -->
        <div class="abilities">
            <h3 class="abilities-title">SPECIAL ABILITIES</h3>
            {#each abilities as ability (ability.id)}
                <div class="ability-item">
                    <span class="ability-name">"{ability.name}"</span>
                    <span class="ability-description"
                        >{ability.description}</span
                    >
                </div>
            {/each}
        </div>

        <!-- Tagline -->
        <div class="tagline">
            {author.tagline || 'functional & automated'}
        </div>

        <!-- Specialization Tags -->
        <div class="specialties">
            {#each author.specialties || [] as specialty (specialty)}
                <span class="specialty-tag">{specialty}</span>
            {/each}
        </div>

        <!-- Reverse Holo Effect Layers -->
        <div class="card__shine"></div>
        <div class="card__glare"></div>
    </div>
</main>

<style>
    .card-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            ellipse at center,
            var(--color-surface) 0%,
            var(--color-surface-dark) 50%,
            var(--raw-color-gray-850) 100%
        );
        padding: var(--raw-space-32);
    }

    .trading-card {
        width: 350px;
        height: 500px;
        background: linear-gradient(
            135deg,
            var(--color-surface) 0%,
            var(--color-surface-dark) 100%
        );
        border-radius: var(--raw-radius-lg);
        border: 2px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted));
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        padding: var(--raw-space-16);
        display: flex;
        flex-direction: column;
        color: var(--color-text);
        font-family: 'Courier New', monospace;

        &:hover {
            transform: rotateY(5deg) rotateX(5deg);
            border-color: rgba(var(--color-accent-rgb), 0.8);
            box-shadow: 0 20px 40px rgba(var(--color-accent-rgb), 0.2);
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                radial-gradient(
                    circle at 20% 80%,
                    rgba(var(--color-accent-rgb), var(--raw-opacity-light)) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    circle at 80% 20%,
                    rgba(var(--color-accent-rgb), var(--raw-opacity-light)) 0%,
                    transparent 50%
                );
            pointer-events: none;
        }
    }

    .card-header {
        text-align: center;
        margin-bottom: 1rem;
        z-index: 2;
        position: relative;
    }

    .name {
        font-size: var(--raw-text-xl);
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--raw-space-8) 0;
        text-shadow: 0 0 10px
            rgba(var(--color-accent-rgb), var(--raw-opacity-medium));
        background: linear-gradient(
            45deg,
            var(--color-accent),
            var(--raw-color-orange-400)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .domain {
        font-size: var(--raw-text-base);
        color: var(--color-accent);
        display: block;
        margin-bottom: var(--raw-space-8);
    }

    .level-bar {
        font-size: var(--raw-text-xs);
        color: var(--color-text-muted);
    }

    .xp-bar {
        width: 100%;
        height: 4px;
        background: rgba(var(--color-text-rgb), var(--raw-opacity-light));
        border-radius: 2px;
        margin-top: var(--raw-space-4);
        overflow: hidden;
    }

    .xp-fill {
        width: 95%;
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--color-accent),
            var(--raw-color-orange-400)
        );
        animation: fillXP 2s ease-out;
    }

    .avatar-section {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        position: relative;
    }

    .hex-frame {
        position: relative;
        width: 80px;
        height: 80px;
    }

    .avatar {
        width: 100%;
        height: 100%;
        border-radius: var(--raw-radius-full);
        border: 2px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-medium));
        transition: all 0.3s ease;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        border-radius: var(--raw-radius-full);
        border: 2px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-medium));
        background: linear-gradient(
            135deg,
            var(--color-surface) 0%,
            var(--color-surface-dark) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .avatar-initials {
        color: var(--color-accent);
        font-size: var(--raw-text-xl);
        font-weight: var(--font-weight-bold);
        text-shadow: 0 0 10px
            rgba(var(--color-accent-rgb), var(--raw-opacity-medium));
    }

    .trading-card:hover .avatar,
    .trading-card:hover .avatar-placeholder {
        transform: scale(1.05);
        border-color: rgba(var(--color-accent-rgb), 0.8);
    }

    .glow-effect {
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: var(--raw-radius-full);
        background: conic-gradient(
            from 0deg,
            var(--color-accent),
            var(--raw-color-orange-400),
            var(--color-accent)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .trading-card:hover .glow-effect {
        opacity: var(--raw-opacity-muted);
        animation: rotate 3s linear infinite;
    }

    .stats-panel {
        margin-bottom: var(--raw-space-16);
        flex: 1;
    }

    .stats-title {
        font-size: var(--raw-text-sm);
        color: var(--color-accent);
        margin: 0 0 var(--raw-space-8) 0;
        text-align: center;
        letter-spacing: 1px;
    }

    .stat-item {
        display: flex;
        align-items: center;
        margin-bottom: var(--raw-space-4);
        font-size: var(--raw-text-xs);
    }

    .stat-label {
        width: 80px;
        color: var(--color-text-muted);
        font-size: 0.6rem;
    }

    .stat-bar {
        flex: 1;
        height: 6px;
        background: rgba(var(--color-text-rgb), var(--raw-opacity-light));
        border-radius: 3px;
        margin: 0 var(--raw-space-8);
        overflow: hidden;
    }

    .stat-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            var(--raw-color-orange-400) 100%
        );
        width: var(--stat-value);
        animation: fillBar 2s ease-out;
        border-radius: 3px;
    }

    .stat-value {
        width: 30px;
        text-align: right;
        color: var(--color-accent);
        font-size: 0.6rem;
    }

    .abilities {
        margin-bottom: var(--raw-space-16);
    }

    .abilities-title {
        font-size: var(--raw-text-sm);
        color: var(--color-accent);
        margin: 0 0 var(--raw-space-8) 0;
        text-align: center;
        letter-spacing: 1px;
    }

    .ability-item {
        margin-bottom: var(--raw-space-4);
        font-size: 0.6rem;
        text-align: center;
    }

    .ability-name {
        color: var(--color-accent);
        font-weight: var(--font-weight-bold);
        display: block;
    }

    .ability-description {
        color: var(--color-text-muted);
        font-size: 0.55rem;
    }

    .tagline {
        text-align: center;
        font-size: var(--raw-text-base);
        color: var(--color-accent);
        font-style: italic;
        margin-bottom: var(--raw-space-8);
        text-shadow: 0 0 5px
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted));
    }

    .specialties {
        display: flex;
        flex-wrap: wrap;
        gap: var(--raw-space-4);
        justify-content: center;
    }

    .specialty-tag {
        background: rgba(var(--color-accent-rgb), 0.2);
        color: var(--color-accent);
        padding: var(--raw-space-4) var(--raw-space-8);
        border-radius: var(--raw-radius-xs);
        font-size: 0.6rem;
        border: 1px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted));
    }

    @keyframes fillBar {
        from {
            width: 0%;
        }
        to {
            width: var(--stat-value);
        }
    }

    @keyframes fillXP {
        from {
            width: 0%;
        }
        to {
            width: 95%;
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .card-container {
            padding: 1rem;
        }

        .trading-card {
            width: 280px;
            height: 400px;

            &:hover {
                transform: none;
            }
        }

        .name {
            font-size: 1.2rem;
        }

        .stat-item {
            font-size: 0.65rem;
        }
    }

    @media (max-width: 480px) {
        .trading-card {
            width: 250px;
            height: 350px;
        }

        .name {
            font-size: 1.1rem;
        }

        .abilities {
            display: none;
        }
    }

    /* Reverse Holo Effect */
    .trading-card {
        --foil-brightness: 0.55;
        --pointer-x: 50%;
        --pointer-y: 50%;
        --pointer-from-left: 0.5;
        --pointer-from-top: 0.5;
        --pointer-from-center: 1;
        --card-opacity: 0;
    }

    .card__shine {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: var(--raw-radius-lg);
        background-image:
            radial-gradient(
                circle at var(--pointer-x) var(--pointer-y),
                var(--color-text) 5%,
                #000 50%,
                var(--color-text) 80%
            ),
            linear-gradient(-45deg, #000 15%, var(--color-text), #000 85%),
            linear-gradient(
                135deg,
                rgba(var(--color-accent-rgb), var(--raw-opacity-muted)) 0%,
                rgba(var(--raw-color-orange-400-rgb), var(--raw-opacity-muted))
                    50%,
                rgba(var(--color-accent-rgb), var(--raw-opacity-muted)) 100%
            );
        background-blend-mode: soft-light, difference;
        background-size:
            120% 120%,
            200% 200%,
            cover;
        background-position:
            center center,
            calc(100% * var(--pointer-from-left))
                calc(100% * var(--pointer-from-top)),
            center center;
        filter: brightness(var(--foil-brightness)) contrast(1.5) saturate(1);
        mix-blend-mode: color-dodge;
        opacity: calc((1.5 * var(--card-opacity)) - var(--pointer-from-center));
        pointer-events: none;
        z-index: 1;
    }

    .card__glare {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: var(--raw-radius-lg);
        opacity: var(--card-opacity);
        background-image: radial-gradient(
            farthest-corner circle at var(--pointer-x) var(--pointer-y),
            hsla(0, 0%, 100%, 0.8) 10%,
            hsla(0, 0%, 100%, 0.5) 20%,
            hsla(0, 0%, 0%, 0.75) 90%
        );
        filter: brightness(0.7) contrast(1.5);
        pointer-events: none;
        z-index: 2;
    }

    .card__glare::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: var(--raw-radius-lg);
        opacity: var(--card-opacity);
        background-image: radial-gradient(
            farthest-corner circle at var(--pointer-x) var(--pointer-y),
            hsl(0, 0%, 100%) 10%,
            hsla(0, 0%, 100%, 0.5) 20%,
            hsla(0, 0%, 0%, 0.5) 120%
        );
        filter: brightness(1) contrast(1.5);
    }
</style>
