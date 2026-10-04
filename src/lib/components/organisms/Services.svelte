<script lang="ts">
    import ContentSection from '#lib/components/organisms/ContentSection.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale, type TranslationKeys } from '#lib/i18n/index.js';
    import Glyph, { type GlyphKind } from '#lib/icons/glyph.svelte';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    const services = ['product', 'delivery', 'platform'] as const;
    const serviceGlyph: Record<(typeof services)[number], GlyphKind> = {
        platform: 'cube',
        delivery: 'loop',
        product: 'pointer',
    };
    // Small commits on the line below each release, uneven like a real history. The last run
    // trails off past the final release: work goes on.
    const commits: Record<(typeof services)[number], number> = {
        product: 3,
        delivery: 4,
        platform: 2,
    };

    // Merge confetti, after GitHub's "Branch merged" banner, drawn from the craft's own glyphs:
    // positions in % of the field, size in px, depth 0–2 sets opacity and how far the glyph floats.
    const confetti: {
        kind: GlyphKind;
        x: number;
        y: number;
        size: number;
        depth: 0 | 1 | 2;
        turn: number;
    }[] = [
        { kind: 'cube', x: 10, y: 20, size: 28, depth: 1, turn: -12 },
        { kind: 'lambda', x: 32, y: 64, size: 52, depth: 2, turn: 8 },
        { kind: 'prompt', x: 54, y: 14, size: 16, depth: 0, turn: 0 },
        { kind: 'braces', x: 72, y: 46, size: 22, depth: 1, turn: -6 },
        { kind: 'loop', x: 88, y: 52, size: 40, depth: 2, turn: 14 },
        { kind: 'pointer', x: 12, y: 82, size: 16, depth: 0, turn: -20 },
        { kind: 'lambda', x: 40, y: 30, size: 14, depth: 0, turn: 30 },
        { kind: 'cube', x: 64, y: 84, size: 26, depth: 1, turn: -4 },
        { kind: 'loop', x: 92, y: 74, size: 18, depth: 0, turn: 10 },
        { kind: 'braces', x: 20, y: 46, size: 16, depth: 0, turn: -14 },
        { kind: 'sparkle', x: 50, y: 50, size: 12, depth: 1, turn: 0 },
        { kind: 'sparkle', x: 4, y: 56, size: 8, depth: 0, turn: 0 },
        { kind: 'sparkle', x: 78, y: 16, size: 14, depth: 2, turn: 20 },
    ];

    // Names, dates and roles read the same in both languages; only the outcome is translated.
    const results: {
        company: string;
        years: string;
        role: string;
        text: keyof TranslationKeys;
    }[] = [
        {
            company: 'Klingel Gruppe',
            years: '2021–2023',
            role: 'Senior DevOps Engineer',
            text: 'results.klingel',
        },
        {
            company: 'Fielmann AG',
            years: '2018–2020',
            role: 'Tech Lead',
            text: 'results.fielmann',
        },
        {
            company: 'Briends GmbH (Papego)',
            years: '2012–2023',
            role: 'Co-Founder',
            text: 'results.papego',
        },
    ];
</script>

<section id="services" class="merged" aria-labelledby="services-title">
    <header>
        <h2 id="services-title">{t(locale, 'services.title')}</h2>
        <p>{t(locale, 'services.description')}</p>
    </header>

    <div class="confetti" aria-hidden="true">
        {#each confetti as glyph, index (index)}
            <span
                class="glyph depth-{glyph.depth}"
                class:sparkle={glyph.kind === 'sparkle'}
                style:--x="{glyph.x}%"
                style:--y="{glyph.y}%"
                style:--size="{glyph.size}px"
                style:--turn="{glyph.turn}deg"
                style:--float="{7 + ((index * 5) % 6)}s"
                style:--phase="{-index * 1.7}s"
            >
                <Glyph kind={glyph.kind} width="100%" height="100%" />
            </span>
        {/each}
    </div>

    <!-- The services as releases on one line of commits, each marked with its glyph. -->
    <ol class="log">
        {#each services as service (service)}
            <li>
                <span class="node" aria-hidden="true">
                    <Glyph
                        kind={serviceGlyph[service]}
                        width="16px"
                        height="16px"
                    />
                </span>
                <span class="commits" aria-hidden="true">
                    {#each { length: commits[service] }, index (index)}
                        <span class="commit"></span>
                    {/each}
                </span>
                <h3>{t(locale, `services.${service}.title`)}</h3>
                <p>{t(locale, `services.${service}.text`)}</p>
            </li>
        {/each}
    </ol>
</section>

<ContentSection
    id="results"
    title={t(locale, 'results.title')}
    description={t(locale, 'results.description')}
>
    <ul class="cards">
        {#each results as result (result.company)}
            <li class="card">
                <h3>{result.company}</h3>
                <p class="meta">
                    <span class="role">{result.role}</span>
                    <span class="years">{result.years}</span>
                </p>
                <p>{t(locale, result.text)}</p>
            </li>
        {/each}
    </ul>
</ContentSection>

<style>
    /* The merged band: GitHub's "Branch merged" banner in the forge palette. An ember wash with
     * ambient light pooled in two corners, merge confetti, and the services as a git log. */
    .merged {
        position: relative;
        isolation: isolate;
        display: grid;
        grid-template-columns: 2fr 3fr;
        grid-template-rows: auto 1fr;
        grid-template-areas:
            'head log'
            'confetti log';
        column-gap: var(--space-major);
        row-gap: var(--space-group);
        margin: var(--space-section) 0;
        padding: var(--space-section);
        border: 1px solid var(--color-bar-start);
        border-radius: var(--radius-card);
        background:
            radial-gradient(
                ellipse 70% 90% at 0% 100%,
                var(--color-merged-glow-violet),
                transparent 60%
            ),
            radial-gradient(
                ellipse 60% 70% at 100% 0%,
                var(--color-merged-glow-forge),
                transparent 50%
            ),
            linear-gradient(
                60deg,
                var(--color-bar-start) 0%,
                var(--color-bar-end) 100%
            );
        /* clip, not hidden: a scroll container would capture the glyphs' view() timelines. */
        overflow: clip;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas: 'confetti' 'head' 'log';
            row-gap: var(--space-block);
            padding: var(--space-block);
        }
    }

    header {
        grid-area: head;

        h2 {
            margin: 0;
            color: var(--color-accent);
            font-size: var(--text-heading-2);
            line-height: var(--text-heading-leading);
            text-wrap: balance;
        }

        p {
            max-width: 32ch;
            margin: var(--space-tight) 0 0;
            color: var(--color-text-lead);
            text-wrap: pretty;
        }
    }

    /* Bleeds into the band's padding so glyphs crop at the edge, like the banner's. */
    .confetti {
        --scale: 1.25;
        --reach: 1;
        grid-area: confetti;
        position: relative;
        min-height: calc(var(--space-major) * 3);
        margin: 0 0 calc(-1 * var(--space-section))
            calc(-1 * var(--space-section));

        @media (max-width: 900px) {
            --scale: 0.75;
            /* The strip is short: float half as far. */
            --reach: 0.5;
            min-height: calc(var(--space-major) + var(--space-stack));
            margin: calc(-1 * var(--space-block)) calc(-1 * var(--space-block))
                0;
        }
    }

    .glyph {
        position: absolute;
        left: var(--x);
        top: var(--y);
        display: block;
        width: calc(var(--size) * var(--scale));
        aspect-ratio: 1;
        translate: -50% -50%;
        rotate: var(--turn);
        color: var(--color-accent);

        &.depth-0 {
            --drift: calc(var(--space-inline) * var(--reach));
            opacity: var(--opacity-border);
        }
        &.depth-1 {
            --drift: calc(var(--space-stack) * var(--reach));
            opacity: var(--opacity-half);
        }
        &.depth-2 {
            --drift: calc(var(--space-group) * var(--reach));
            opacity: var(--opacity-text-muted);
        }
        &.sparkle {
            color: var(--color-sparkle);
        }

        :global(svg) {
            display: block;
        }
    }

    /* Rail geometry: a straight trunk through the nodes, each node sitting on the first line of
     * its title. */
    .log {
        --node: 28px;
        --commit: 8px;
        --trunk-x: calc(var(--node) / 2);
        --node-top: calc(
            (var(--text-large) * var(--text-heading-leading) - var(--node)) / 2
        );
        --node-center: calc(var(--node-top) + var(--node) / 2);
        --trunk-color: rgba(var(--color-accent-rgb), var(--opacity-border));

        grid-area: log;
        align-self: center;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            position: relative;
            display: grid;
            grid-template-columns: calc(var(--trunk-x) + var(--node) / 2) 1fr;
            column-gap: var(--space-stack);
            row-gap: var(--space-inline);
            padding-bottom: var(--space-group);

            &::before {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: calc(var(--trunk-x) - 1px);
                width: 2px;
                background: var(--trunk-color);
            }

            &:first-child::before {
                top: calc(-1 * var(--space-block));
                background: linear-gradient(
                    to bottom,
                    transparent,
                    var(--trunk-color) var(--space-group)
                );
            }

            /* The line carries on past the last node. */
            &:last-child {
                padding-bottom: var(--space-block);

                &::before {
                    background: linear-gradient(
                        to bottom,
                        var(--trunk-color) var(--node-center),
                        transparent
                    );
                }
            }
        }

        h3,
        p {
            grid-column: 2;
            margin: 0;
        }

        h3 {
            font-size: var(--text-large);
            line-height: var(--text-heading-leading);
            text-wrap: balance;
        }

        p {
            max-width: 60ch;
            font-size: var(--text-ui);
            color: var(--color-text-muted);
            line-height: var(--text-body-leading);
            text-wrap: pretty;
        }
    }

    /* Small commits between releases: plain dots on the trunk, spread evenly from below the node to
     * the next one. The dot is drawn by ::before so the span stays an untransformed timeline
     * subject. */
    .commits {
        position: absolute;
        top: calc(var(--node-top) + var(--node));
        bottom: 0;
        left: calc(var(--trunk-x) - var(--commit) / 2);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: var(--commit);
    }

    .commit {
        display: block;
        width: var(--commit);
        height: var(--commit);

        &::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: var(--radius-full);
            background: var(--color-accent);
        }
    }

    /* The merged badge: solid forge, like the banner's status chip, carrying the service's glyph. */
    .node {
        position: absolute;
        top: var(--node-top);
        left: calc(var(--trunk-x) - var(--node) / 2);
        display: grid;
        place-items: center;
        width: var(--node);
        height: var(--node);
        border-radius: var(--radius-full);
        background: var(--color-accent);
        color: var(--color-text-inverse);
    }

    /* Motion: the confetti floats on its own, slow and out of step, further the nearer it sits.
     * Scroll scrubs the log against a scan line 60% down the viewport: the trunk's tip follows
     * it, each small commit pops in as the tip reaches it, and each release lands with a flash of
     * the Halo. Without scroll timelines the log rests drawn; with reduced motion everything
     * rests. */
    @media (prefers-reduced-motion: no-preference) {
        .glyph :global(svg) {
            animation: float var(--float) ease-in-out var(--phase) infinite;
        }

        @supports (animation-timeline: view()) {
            .log {
                --scan-inset: 0 40%;
                --pop: 4rem;
            }

            .log li {
                view-timeline: --release block;
                view-timeline-inset: var(--scan-inset);

                /* li's top to bottom crossing the scan line: the tip sits on it throughout. */
                &::before {
                    transform-origin: top;
                    animation: trunk linear both;
                    animation-timeline: --release;
                    animation-range: entry-crossing 0% entry-crossing 100%;
                }
            }

            .node {
                animation: merge linear both;
                animation-timeline: --release;
                animation-range: entry var(--node-top) entry
                    calc(var(--node-center) + var(--pop));
            }

            .commit {
                view-timeline: --commit block;
                view-timeline-inset: var(--scan-inset);

                &::before {
                    animation: commit linear both;
                    animation-timeline: --commit;
                    animation-range: entry 0% entry calc(0% + var(--pop) / 2);
                }
            }
        }
    }

    @keyframes trunk {
        from {
            transform: scaleY(0);
        }
    }

    @keyframes merge {
        0% {
            scale: 0.4;
            opacity: 0;
        }
        55% {
            scale: 1.15;
            opacity: 1;
            box-shadow: 0 0 1px 7px
                rgba(var(--color-accent-rgb), var(--opacity-border));
        }
        100% {
            scale: 1;
            box-shadow: 0 0 0 0 rgba(var(--color-accent-rgb), 0);
        }
    }

    @keyframes commit {
        0% {
            scale: 0;
            opacity: 0;
        }
        60% {
            scale: 1.5;
            opacity: 1;
        }
        100% {
            scale: 1;
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translate(0, 0) rotate(0deg);
        }
        33% {
            transform: translate(
                    calc(var(--drift) * 0.4),
                    calc(-1 * var(--drift))
                )
                rotate(5deg);
        }
        66% {
            transform: translate(
                    calc(var(--drift) * -0.4),
                    calc(var(--drift) * -0.4)
                )
                rotate(-4deg);
        }
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-block);
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .card {
        display: grid;
        align-content: start;
        gap: var(--space-inline);
        margin: 0;
        padding: var(--space-block);
        border-radius: var(--radius-card);
        background-color: var(--color-surface-elevated);
        box-shadow: inset 0 1px 0 var(--color-hairline);

        h3 {
            font-size: var(--text-large);
            text-wrap: balance;
            margin: 0;
        }

        p {
            margin: 0;
            font-size: var(--text-ui);
            color: var(--color-text-muted);
            line-height: var(--text-body-leading);
            text-wrap: pretty;
        }

        /* Role and years wrap as two items. The dot hangs in the 3ch before the years, so when they
           wrap to their own line it falls outside the left edge and is clipped. */
        .meta {
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            font-family: var(--font--mono), monospace;
            font-size: var(--text-small);
            color: var(--color-accent-text);

            .role {
                margin-inline-end: 3ch;
            }

            .years {
                white-space: nowrap;

                &::before {
                    content: '·';
                    display: inline-block;
                    width: 3ch;
                    margin-inline-start: -3ch;
                    text-align: center;
                }
            }
        }
    }
</style>
