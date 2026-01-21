<script lang="ts">
    import HoloCard from '$components/molecules/HoloCard.svelte';
    import Button from '$components/atoms/Button.svelte';
    import Sparkles from '$components/atoms/Sparkles.svelte';
    import CalendarIcon from '$lib/icons/calendar.svelte';
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import MeSrc from '$assets/images/authors/jloos.png?as=run&fit=cover';
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
                <span>Full-Stack Functional Architectures</span>
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
        width: fit-content;
    }

    .headline {
        font-size: var(--raw-text-4xl);
        line-height: var(--raw-leading-tight);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;

        @include breakpoints.for-phone-only {
            font-size: var(--raw-text-3xl);
        }

        .accent {
            color: var(--color-accent);
        }
    }

    .subheadline {
        font-size: var(--raw-text-lg);
        line-height: var(--raw-leading-relaxed);
        color: rgba(var(--color-text-rgb), var(--raw-opacity-strong));
        margin: 0;
        max-width: 480px;
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
        font-size: var(--raw-text-sm);
        color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));

        @include breakpoints.for-tablet-portrait-down {
            justify-content: center;
        }

        .dot {
            width: 4px;
            height: 4px;
            border-radius: var(--raw-radius-full);
            background-color: rgba(
                var(--color-accent-rgb),
                var(--raw-opacity-muted)
            );
        }
    }

    .card-column {
        display: flex;
        justify-content: center;

        @include breakpoints.for-tablet-portrait-down {
            order: 1;
        }
    }

    /* Trading Card Interior */
    .trading-card {
        font-family: var(--font--mono);
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-16);
        width: 280px;
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
        aspect-ratio: 1 / 1;
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
        color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));
        text-transform: uppercase;
    }

    .stat-value {
        color: var(--color-text);
        font-size: var(--raw-text-sm);
    }

    .ability-box {
        border-left: 2px solid var(--color-accent);
        padding-left: var(--raw-space-12);
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
        font-size: var(--raw-text-xs);
        font-weight: 700;
        padding: var(--raw-space-4) var(--raw-space-8);
        background-color: var(--color-accent);
        color: var(--color-surface);
        border-radius: var(--raw-radius-xs);
        text-transform: uppercase;
    }

    .ability-name {
        font-size: var(--raw-text-sm);
        font-weight: 600;
        color: var(--color-text);
    }

    .ability-description {
        font-size: var(--raw-text-xs);
        color: rgba(var(--color-text-rgb), var(--raw-opacity-strong));
        line-height: var(--raw-leading-relaxed);
        margin: 0;
    }

    .card-footer {
        font-size: var(--raw-text-xs);
        color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));
        text-align: center;
        padding-top: var(--raw-space-8);
        border-top: 1px solid
            rgba(var(--color-text-rgb), var(--raw-opacity-subtle));
    }
</style>
