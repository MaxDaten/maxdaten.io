<script lang="ts">
    import Sparkle from '#lib/components/atoms/SingleSparkle.svelte';
    import type { SparkleType } from '#lib/utils/types.js';
    import { prefersReducedMotion } from 'svelte/motion';

    // Auto-played motion must stop within five seconds (WCAG 2.2.2); afterwards the
    // sparkles return only while the wrapped control is hovered or focused.
    const BURST_MS = 3500;
    const SPAWN_MS = 400;

    const random = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min)) + min;

    interface Props {
        color?: 'default' | 'primary' | 'secondary';
        children?: import('svelte').Snippet;
    }

    let { color = 'default', children }: Props = $props();

    let nextId = 0;
    const generateSparkle = (): SparkleType => {
        return {
            id: String(nextId++),
            createdAt: Date.now(),
            color:
                color === 'primary'
                    ? 'var(--color-accent)'
                    : color === 'secondary'
                      ? 'var(--color-accent)'
                      : 'var(--color-sparkle)',
            size: random(10, 20),
            style: {
                // Pick a random spot in the available space
                top: random(-10, 80) + '%',
                left: random(0, 100) + '%',
            },
        };
    };

    let sparkles: SparkleType[] = $state([]);
    let bursting = $state(true);
    let engaged = $state(false);
    let active = $derived(
        !prefersReducedMotion.current && (bursting || engaged)
    );

    $effect(() => {
        const timeout = setTimeout(() => (bursting = false), BURST_MS);
        return () => clearTimeout(timeout);
    });

    $effect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            sparkles = [...sparkles, generateSparkle()];
        }, SPAWN_MS);
        return () => clearInterval(interval);
    });

    const remove = (id: string) => {
        sparkles = sparkles.filter((sparkle) => sparkle.id !== id);
    };
</script>

<div
    class="sparkle-wrapper"
    role="presentation"
    onpointerenter={() => (engaged = true)}
    onpointerleave={() => (engaged = false)}
    onfocusin={() => (engaged = true)}
    onfocusout={() => (engaged = false)}
>
    {#each sparkles as sparkle (sparkle.id)}
        <Sparkle
            color={sparkle.color}
            size="{sparkle.size}px"
            style={sparkle.style}
            onend={() => remove(sparkle.id)}
        />
    {/each}
    <span class="slot-wrapper">
        {@render children?.()}
    </span>
</div>

<style>
    .sparkle-wrapper {
        position: relative;
        display: inline-block;

        .slot-wrapper {
            position: relative;
            z-index: 1;
        }
    }
</style>
