<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import HoloCard from './HoloCard.svelte';

    const { Story } = defineMeta({
        title: 'Molecules/HoloCard',
        component: HoloCard,
        tags: ['autodocs'],
        parameters: {
            docs: {
                description: {
                    component:
                        'A holographic trading card component with 3D perspective tilt on mouse movement. Respects prefers-reduced-motion for accessibility.',
                },
            },
        },
    });
</script>

<Story name="Default">
    {#snippet template()}
        <div style="max-width: 320px; margin: 40px auto;">
            <HoloCard>
                <div
                    style="color: var(--color-text); font-family: var(--font--mono);"
                >
                    <div
                        style="display: flex; justify-content: space-between; font-size: var(--raw-text-xs); color: #888; margin-bottom: var(--raw-space-8);"
                    >
                        <span>MAXDATEN.IO</span>
                        <span style="color: var(--color-accent);">LVL 99</span>
                    </div>
                    <div
                        style="width: 100%; aspect-ratio: 1/1; background: #000; border-radius: var(--raw-radius-sm); margin-bottom: var(--raw-space-16); border: 1px solid #333;"
                    ></div>
                    <h3
                        style="font-size: var(--raw-text-xl); margin: 0 0 var(--raw-space-12) 0; text-transform: uppercase;"
                    >
                        Jan-Philip
                    </h3>
                    <div
                        style="font-size: var(--raw-text-xs); border-bottom: 1px solid #333; padding: 4px 0; display: flex; justify-content: space-between;"
                    >
                        <span style="color: #888;">CLASS</span>
                        <span>DevOps Consultant</span>
                    </div>
                    <div
                        style="font-size: var(--raw-text-xs); border-bottom: 1px solid #333; padding: 4px 0; display: flex; justify-content: space-between;"
                    >
                        <span style="color: #888;">SPECIALTY</span>
                        <span>Infrastructure as Code</span>
                    </div>
                </div>
            </HoloCard>
        </div>
    {/snippet}
</Story>

<Story name="Simple Content">
    {#snippet template()}
        <div style="max-width: 300px; margin: 40px auto;">
            <HoloCard>
                <h2
                    style="color: var(--color-text); margin: 0 0 var(--raw-space-8) 0;"
                >
                    Holographic Card
                </h2>
                <p style="color: #888; margin: 0;">
                    Move your mouse over this card to see the 3D tilt and
                    holographic sheen effect.
                </p>
            </HoloCard>
        </div>
    {/snippet}
</Story>

<Story name="Wide Card">
    {#snippet template()}
        <div style="max-width: 500px; margin: 40px auto;">
            <HoloCard>
                <div style="color: var(--color-text);">
                    <h3 style="margin: 0 0 var(--raw-space-12) 0;">
                        Wide Trading Card
                    </h3>
                    <p style="color: #888; margin: 0;">
                        The effect works on any card size. The tilt and sheen
                        track the mouse position relative to the card bounds.
                    </p>
                </div>
            </HoloCard>
        </div>
    {/snippet}
</Story>
