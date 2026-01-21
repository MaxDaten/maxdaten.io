<script lang="ts">
    import HoloCard from '$components/molecules/HoloCard.svelte';
    import Button from '$components/atoms/Button.svelte';
    import Sparkles from '$components/atoms/Sparkles.svelte';
    import CalendarIcon from '$lib/icons/calendar.svelte';
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import MeSrc from '$assets/images/authors/jloos-v2.jpeg?as=run&fit=cover';
    import { FxReveal as Img } from '@zerodevx/svelte-img';
</script>

<section id="hero">
    <div class="hero-grid">
        <!-- Left Column: Value Proposition -->
        <div class="content">
            <span class="badge">Available for 2026</span>
            <h1 class="headline">
                From chaotic deploys to <span class="accent"
                    >confident releases</span
                >.
            </h1>
            <p class="subheadline">
                Hands-on infrastructure work plus the knowledge transfer so your
                team owns it after I leave. 12+ years scaling systems from
                startup to 100M+ requests/day.
            </p>
            <div class="ctas">
                <Sparkles>
                    <Button
                        size="medium"
                        style="solid"
                        color="primary"
                        href="https://calendar.app.google/KhVdEThcwSEBCjat5"
                    >
                        {#snippet icon()}
                            <CalendarIcon />
                        {/snippet}
                        Book a Call
                    </Button>
                </Sparkles>
                <Button
                    size="medium"
                    style="ghost"
                    color="secondary"
                    href="https://github.com/MaxDaten"
                >
                    {#snippet icon()}
                        <GitHubIcon />
                    {/snippet}
                    View Projects
                </Button>
            </div>
            <div class="tech-ticker">
                <span>K8s at Scale</span>
                <span class="dot"></span>
                <span>Multi-Cloud</span>
                <span class="dot"></span>
                <span>GitOps</span>
                <span class="dot"></span>
                <span>Full-Stack Architectures</span>
            </div>
        </div>

        <!-- Right Column: Trading Card -->
        <div class="card-column">
            <HoloCard>
                <div class="trading-card">
                    <div class="card-header">
                        <span class="card-title">MAXDATEN.IO</span>
                        <span class="card-level">LVL 99</span>
                    </div>
                    <div class="avatar-container">
                        <Img
                            src={MeSrc}
                            {...{
                                class: 'avatar-image',
                                alt: 'Jan-Philip Loos',
                            }}
                        />
                    </div>
                    <div class="card-name">JAN-PHILIP</div>
                    <div class="stat-rows">
                        <div class="stat-row">
                            <span class="stat-label">CLASS</span>
                            <span class="stat-value"
                                >Platform Engineering Advisor</span
                            >
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">SPECIALTY</span>
                            <span class="stat-value"
                                >Platform Engineering & Team Enablement</span
                            >
                        </div>
                    </div>
                    <div class="ability-box">
                        <div class="ability-header">
                            <span class="pro-badge">PRO</span>
                            <span class="ability-name">Enterprise Rollouts</span
                            >
                        </div>
                        <p class="ability-description">
                            Deployed to 700+ retail locations at Fielmann
                        </p>
                    </div>
                    <div class="card-footer">#001 &middot; HAMBURG, DE</div>
                </div>
            </HoloCard>
        </div>
    </div>
</section>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    #hero {
        padding: var(--raw-space-80) 0;

        @include breakpoints.for-tablet-portrait-down {
            padding: var(--raw-space-48) 0;
        }
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--raw-space-48);
        align-items: center;

        @include breakpoints.for-tablet-portrait-down {
            grid-template-columns: 1fr;
            gap: var(--raw-space-32);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-24);

        @include breakpoints.for-tablet-portrait-down {
            align-items: center;
            text-align: center;
            order: 2;
        }
    }

    .badge {
        font-family: var(--font--mono);
        font-size: var(--raw-text-sm);
        padding: var(--raw-space-8) var(--raw-space-16);
        border: 1px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted));
        border-radius: var(--raw-radius-full);
        color: var(--color-accent);
        background: rgba(0, 0, 0, 0.3);
        width: fit-content;
    }

    .headline {
        font-size: var(--raw-text-4xl);
        line-height: var(--raw-leading-tight);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
        text-wrap: balance;

        @include breakpoints.for-phone-only {
            font-size: var(--raw-text-3xl);
        }

        .accent {
            background: linear-gradient(90deg, #ff8000 0%, #ff9933 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    }

    .subheadline {
        font-size: var(--raw-text-lg);
        line-height: var(--raw-leading-relaxed);
        color: #d1d5db;
        margin: 0;
        max-width: 540px;
    }

    .ctas {
        display: flex;
        flex-wrap: wrap;
        gap: var(--raw-space-12);

        @include breakpoints.for-tablet-portrait-down {
            justify-content: center;
        }
    }

    .tech-ticker {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--raw-space-12);
        font-family: var(--font--mono);
        font-size: 13px;
        color: #9ca3af;
        margin-top: var(--raw-space-24);

        @include breakpoints.for-tablet-portrait-down {
            justify-content: center;
        }

        .dot {
            width: 4px;
            height: 4px;
            border-radius: var(--raw-radius-full);
            background-color: var(--color-accent);
            opacity: 0.8;
        }
    }

    .card-column {
        display: flex;
        justify-content: center;

        @include breakpoints.for-tablet-portrait-down {
            order: 1;
        }
    }

    /* Trading Card Interior - 2.5:3.5 trading card ratio */
    .trading-card {
        font-family: var(--font--mono);
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-12);
        width: 450px;
        aspect-ratio: 5 / 7;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--raw-text-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .card-title {
        color: var(--color-text);
    }

    .card-level {
        color: var(--color-accent);
    }

    .avatar-container {
        aspect-ratio: 4 / 3;
        border-radius: var(--raw-radius-sm);
        overflow: hidden;
        background-color: rgba(
            var(--color-text-rgb),
            var(--raw-opacity-subtle)
        );

        :global(.avatar-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-name {
        font-size: var(--raw-text-xl);
        font-weight: 700;
        text-transform: uppercase;
        color: var(--color-text);
        letter-spacing: 0.05em;
    }

    .stat-rows {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-8);
    }

    .stat-row {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-4);
        font-size: var(--raw-text-xs);
    }

    .stat-label {
        font-size: 10px;
        letter-spacing: 0.05em;
        color: #666;
        text-transform: uppercase;
    }

    .stat-value {
        color: var(--color-text);
        font-size: var(--raw-text-sm);
    }

    .ability-box {
        margin-top: var(--raw-space-16);
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        padding: 10px;
        border-left: 3px solid var(--color-accent);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-8);
    }

    .ability-header {
        display: flex;
        align-items: center;
        gap: var(--raw-space-8);
    }

    .pro-badge {
        font-size: 10px;
        font-weight: 700;
        padding: var(--raw-space-4) var(--raw-space-8);
        background-color: var(--color-accent);
        color: black;
        border-radius: 2px;
        text-transform: uppercase;
    }

    .ability-name {
        font-size: var(--raw-text-sm);
        font-weight: 600;
        color: var(--color-text);
    }

    .ability-description {
        font-size: var(--raw-text-xs);
        color: #9ca3af;
        line-height: var(--raw-leading-relaxed);
        margin: 4px 0 0 0;
    }

    .card-footer {
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.05em;
        color: #6b7280;
        text-align: center;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
</style>
