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

    // The mouse moves through the confetti like a stone through water: glyphs near it stream
    // aside, nearer ones (higher depth) further and quicker, and drift back once it passes. Each
    // glyph seeds a cell of a Voronoi grid that bends with them, lit only around the pointer.
    const reach = 140; // px: how far from the pointer glyphs feel it
    const give = [0.3, 0.45, 0.6] as const; // per depth: push at the pointer, × reach
    const lag = [0.36, 0.26, 0.18] as const; // per depth: seconds to close most of the gap

    let field: HTMLElement | undefined = $state();
    let size = { width: 0, height: 0 };
    let pointer: { x: number; y: number } | undefined;
    let offsets = $state.raw(confetti.map(() => ({ x: 0, y: 0 })));
    let lit = $state(false);
    let spot = $state({ x: 0, y: 0 });
    let grid = $state('');
    let frame = 0;
    let last = 0;

    const still = () =>
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches;

    function seeds() {
        return confetti.map((glyph, index) => ({
            x: (glyph.x / 100) * size.width + offsets[index].x,
            y: (glyph.y / 100) * size.height + offsets[index].y,
        }));
    }

    function step(time: number) {
        const dt = last ? Math.min((time - last) / 1000, 0.1) : 1 / 60;
        last = time;
        let moving = false;
        offsets = confetti.map((glyph, index) => {
            let target = { x: 0, y: 0 };
            if (pointer && !still()) {
                const dx = (glyph.x / 100) * size.width - pointer.x;
                const dy = (glyph.y / 100) * size.height - pointer.y;
                const distance = Math.hypot(dx, dy);
                if (distance < reach) {
                    const falloff = (1 - distance / reach) ** 2;
                    const push = falloff * give[glyph.depth] * reach;
                    // Dead centre has no direction: step aside upwards.
                    const [ux, uy] =
                        distance > 0.5
                            ? [dx / distance, dy / distance]
                            : [0, -1];
                    target = { x: ux * push, y: uy * push };
                }
            }
            const current = offsets[index];
            const blend = 1 - Math.exp(-dt / lag[glyph.depth]);
            const next = {
                x: current.x + (target.x - current.x) * blend,
                y: current.y + (target.y - current.y) * blend,
            };
            if (Math.hypot(target.x - next.x, target.y - next.y) > 0.1)
                moving = true;
            return next;
        });
        if (!moving && !pointer) offsets = confetti.map(() => ({ x: 0, y: 0 }));
        grid = voronoi(seeds(), size.width, size.height);
        frame = moving ? requestAnimationFrame(step) : 0;
        if (!moving) last = 0;
    }

    function wake() {
        if (!frame) frame = requestAnimationFrame(step);
    }

    function follow(event: PointerEvent) {
        if (event.pointerType !== 'mouse' || !field) return;
        const box = field.getBoundingClientRect();
        size = { width: box.width, height: box.height };
        pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
        spot = pointer;
        lit = true;
        wake();
    }

    function release() {
        pointer = undefined;
        lit = false;
        wake();
    }

    $effect(() => () => cancelAnimationFrame(frame));

    // The title glitter only sparkles while the page is moving: it faints once scrolling rests.
    let scrolling = $state(false);
    let resting: ReturnType<typeof setTimeout> | undefined;

    function scrolled() {
        scrolling = true;
        clearTimeout(resting);
        resting = setTimeout(() => (scrolling = false), 150);
    }

    $effect(() => () => clearTimeout(resting));

    // The cell edges between seeds, each drawn once, without the field's border: clip the field
    // by the bisector to every other seed, and track which seed made each edge of the cell.
    function voronoi(
        points: { x: number; y: number }[],
        width: number,
        height: number
    ) {
        type Vertex = { x: number; y: number; edge: number };
        const border = -1;
        let path = '';
        points.forEach((seed, i) => {
            let cell: Vertex[] = [
                { x: 0, y: 0, edge: border },
                { x: width, y: 0, edge: border },
                { x: width, y: height, edge: border },
                { x: 0, y: height, edge: border },
            ];
            points.forEach((other, j) => {
                if (j === i || cell.length === 0) return;
                // Keep the side nearer to seed: (p - mid) · (other - seed) <= 0.
                const nx = other.x - seed.x;
                const ny = other.y - seed.y;
                const c =
                    (nx * (seed.x + other.x)) / 2 +
                    (ny * (seed.y + other.y)) / 2;
                const side = (v: { x: number; y: number }) =>
                    v.x * nx + v.y * ny - c;
                const clipped: Vertex[] = [];
                cell.forEach((a, k) => {
                    const b = cell[(k + 1) % cell.length];
                    const sa = side(a);
                    const sb = side(b);
                    const cross = () => {
                        const t = sa / (sa - sb);
                        return {
                            x: a.x + (b.x - a.x) * t,
                            y: a.y + (b.y - a.y) * t,
                        };
                    };
                    if (sa <= 0) {
                        clipped.push(a);
                        if (sb > 0) clipped.push({ ...cross(), edge: j });
                    } else if (sb <= 0) {
                        clipped.push({ ...cross(), edge: a.edge });
                    }
                });
                cell = clipped;
            });
            cell.forEach((a, k) => {
                if (a.edge <= i) return; // border, or drawn from the other cell
                const b = cell[(k + 1) % cell.length];
                path += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
            });
        });
        return path;
    }

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

<svelte:window onscroll={scrolled} />

<section
    id="services"
    class="merged"
    class:scrolling
    aria-labelledby="services-title"
    onpointermove={follow}
    onpointerleave={release}
>
    <header>
        <h2 id="services-title">{t(locale, 'services.title')}</h2>
        <p>{t(locale, 'services.description')}</p>
    </header>

    <div class="confetti" aria-hidden="true" bind:this={field}>
        <svg
            class="voronoi"
            class:lit
            style:--spot-x="{spot.x}px"
            style:--spot-y="{spot.y}px"
        >
            <path d={grid} />
        </svg>
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
                style:transform="translate({offsets[index].x}px, {offsets[index]
                    .y}px)"
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

    /* The cells between the glyphs: barely there, and only in a pool of light at the pointer. */
    .voronoi {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        opacity: 0;
        mask-image: radial-gradient(
            circle calc(var(--space-major) * 2.5) at var(--spot-x) var(--spot-y),
            black,
            transparent
        );
        transition: opacity 0.4s var(--ease-3);

        &.lit {
            opacity: 1;
        }

        path {
            fill: none;
            stroke: rgba(var(--color-accent-rgb), var(--opacity-border));
            stroke-width: 1;
            vector-effect: non-scaling-stroke;
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
        --trunk-top: 0px;

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
                top: var(--trunk-top);
                bottom: 0;
                left: calc(var(--trunk-x) - 1px);
                width: 2px;
                background: var(--trunk-color);
            }

            &:first-child {
                --trunk-top: calc(-1 * var(--space-block));
            }

            &:first-child::before {
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
        /* Above the trunk and its blaze, which are drawn by the li's pseudo-elements. */
        z-index: 1;
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
        z-index: 1;
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
     * it, blazing with a glowing trail; each small commit pops in molten as the tip reaches it,
     * and each release lands with a flash of the Halo. Without scroll timelines the log rests
     * drawn; with reduced motion everything rests. */
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

                /* The blaze: a white-hot head on the tip with a glowing trail behind it, on the
                 * same timeline and range as the trunk so it rides exactly on the tip. It flares
                 * up after each release and burns out into the next. */
                &::after {
                    content: '';
                    position: absolute;
                    left: calc(var(--trunk-x) - 1px);
                    width: 2px;
                    height: var(--space-major);
                    translate: 0 -100%;
                    border-radius: var(--radius-full);
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        var(--color-accent) 80%,
                        color-mix(
                            in srgb,
                            var(--color-sparkle) 60%,
                            var(--color-accent)
                        )
                    );
                    filter: drop-shadow(
                        0 0 3px
                            rgba(var(--color-accent-rgb), var(--opacity-half))
                    );
                    pointer-events: none;
                    animation: blaze linear both;
                    animation-timeline: --release;
                    animation-range: entry-crossing 0% entry-crossing 100%;
                }
            }

            .node {
                animation:
                    merge linear both,
                    ember linear both;
                animation-timeline: --release, --release;
                animation-range:
                    entry var(--node-top) entry
                        calc(var(--node-center) + var(--pop)),
                    entry var(--node-top) entry
                        calc(var(--node-center) + var(--pop) * 2);
            }

            /* The release's colour runs into its title as the blaze lands, like secret ink in a
             * magic book: the title waits a little faded, then a glinting edge sweeps left to
             * right, leaving the accent behind it and a fine twinkling dust along it. Scrubbed
             * with the node, so scrolling back drains it. */
            .log h3 {
                --sweep: calc(var(--node-center) + var(--pop) * 2);

                position: relative;
                /* The sweep spans the words, not the whole column. */
                width: fit-content;
                background: linear-gradient(
                        to right,
                        var(--color-accent-text) 44%,
                        var(--color-sparkle) 48%,
                        rgba(var(--color-text-rgb), var(--opacity-text-muted))
                            54%
                    )
                    100% 0 / 220% 100% no-repeat;
                background-clip: text;
                color: transparent;
                animation: kindle linear both;
                animation-timeline: --release;
                animation-range: entry var(--node-center) entry var(--sweep);

                /* The dust: three sparse speck grids of co-prime sizes read as random glitter,
                 * shown only in a soft band that rides on the sweep's edge, twinkling on the
                 * clock. It faints when scrolling rests (filter, as the sweep owns opacity). */
                &::after {
                    content: '';
                    position: absolute;
                    inset: -0.3em 0;
                    pointer-events: none;
                    filter: opacity(0);
                    transition: filter 0.6s var(--ease-3);
                    background:
                        radial-gradient(
                                circle at 30% 40%,
                                var(--color-sparkle) 0 0.6px,
                                transparent 1.1px
                            )
                            0 0 / 17px 13px,
                        radial-gradient(
                                circle at 70% 25%,
                                var(--color-accent-text) 0 0.5px,
                                transparent 1px
                            )
                            0 0 / 23px 19px,
                        radial-gradient(
                                circle at 45% 75%,
                                var(--color-sparkle) 0 0.7px,
                                transparent 1.2px
                            )
                            0 0 / 29px 11px;
                    mask: linear-gradient(
                            to right,
                            transparent,
                            black 40% 60%,
                            transparent
                        ) -36%
                        0 / 30% 100% no-repeat;
                    animation:
                        dust linear both,
                        twinkle 0.9s steps(1) infinite;
                    animation-timeline: --release, auto;
                    animation-range: entry var(--node-center) entry var(--sweep);
                }
            }

            .commit {
                view-timeline: --commit block;
                view-timeline-inset: var(--scan-inset);

                &::before {
                    animation:
                        commit linear both,
                        ember linear both;
                    animation-timeline: --commit, --commit;
                    animation-range:
                        entry 0% entry calc(0% + var(--pop) / 2),
                        entry 0% entry calc(0% + var(--pop));
                }
            }
        }
    }

    @keyframes trunk {
        from {
            transform: scaleY(0);
        }
    }

    @keyframes blaze {
        0% {
            top: var(--trunk-top);
            opacity: 0;
        }
        8%,
        88% {
            opacity: 1;
        }
        100% {
            top: 100%;
            opacity: 0;
        }
    }

    /* Releases and commits are struck by the blaze and take it in like liquid: each forms as a
     * white-hot drop pulled up towards the trail's head, splats as the head lands, then wobbles
     * like jelly (stretch and squash, damped) and cools into its circle. The ember glow outlasts
     * the wobble, fading as slowly as the trail behind the tip. The radii are drop shapes, not
     * design radii; they all settle on a circle. */
    .scrolling .log h3::after {
        filter: opacity(1);
        transition-duration: 0.15s;
    }

    @keyframes kindle {
        to {
            background-position: 0 0;
        }
    }

    /* The band's centre tracks the kindle edge, which runs from -10% to 110% of the title. */
    @keyframes dust {
        0% {
            mask-position: -36% 0;
            opacity: 0;
        }
        10%,
        85% {
            opacity: var(--opacity-half);
        }
        100% {
            mask-position: 136% 0;
            opacity: 0;
        }
    }

    @keyframes twinkle {
        0% {
            background-position:
                0 0,
                0 0,
                0 0;
        }
        33% {
            background-position:
                3px 2px,
                -4px 3px,
                5px -2px;
        }
        66% {
            background-position:
                -2px 4px,
                2px -3px,
                -5px 1px;
        }
    }

    @keyframes merge {
        0% {
            scale: 0.4 0.55;
            opacity: 0;
            border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
            background: var(--color-sparkle);
        }
        12% {
            background: var(--color-sparkle);
        }
        15% {
            opacity: 1;
        }
        28% {
            scale: 0.88 1.14;
            border-radius: 50% 50% 50% 50% / 64% 64% 36% 36%;
        }
        42% {
            scale: 1.1 0.9;
            border-radius: 50% 50% 50% 50% / 44% 44% 56% 56%;
        }
        55% {
            box-shadow: 0 0 1px 7px
                rgba(var(--color-accent-rgb), var(--opacity-border));
        }
        58% {
            scale: 0.96 1.05;
            border-radius: 50% 50% 50% 50% / 54% 54% 46% 46%;
        }
        74% {
            scale: 1.02 0.98;
            border-radius: 50%;
        }
        88% {
            scale: 0.995 1.01;
        }
        100% {
            scale: 1;
            border-radius: 50%;
            background: var(--color-accent);
            box-shadow: 0 0 0 0 rgba(var(--color-accent-rgb), 0);
        }
    }

    @keyframes commit {
        0% {
            scale: 0;
            opacity: 0;
            border-radius: 50% 50% 50% 50% / 72% 72% 28% 28%;
            background: var(--color-sparkle);
        }
        12% {
            background: var(--color-sparkle);
        }
        20% {
            opacity: 1;
        }
        32% {
            scale: 0.85 1.25;
            border-radius: 50% 50% 50% 50% / 66% 66% 34% 34%;
        }
        50% {
            scale: 1.2 0.85;
            border-radius: 50% 50% 50% 50% / 42% 42% 58% 58%;
        }
        68% {
            scale: 0.95 1.06;
            border-radius: 50% 50% 50% 50% / 54% 54% 46% 46%;
        }
        84% {
            scale: 1.02 0.98;
            border-radius: 50%;
        }
        100% {
            scale: 1;
            border-radius: 50%;
            background: var(--color-accent);
        }
    }

    @keyframes ember {
        0%,
        100% {
            filter: drop-shadow(0 0 0 rgba(var(--color-accent-rgb), 0));
        }
        12% {
            filter: drop-shadow(
                0 0 3px rgba(var(--color-accent-rgb), var(--opacity-half))
            );
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
