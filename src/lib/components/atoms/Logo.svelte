<script>
    /**
     * @typedef {Object} Props
     * @property {boolean} [animated]
     */

    /** @type {Props} */
    let { animated = true } = $props();
</script>

<div class="logo" class:animated>
    <svg viewBox="0 0 223 45" id="logo-text" xml:space="preserve">
        <text
            x="50%"
            y="10%"
            id="text"
            text-anchor="middle"
            dominant-baseline="hanging"
            paint-order="stroke">maxdaten.io</text
        >
    </svg>
</div>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .logo {
        width: auto;
        max-width: 50%;
        min-width: 100px;
        height: 100%;

        display: flex;
        gap: 16px;
        align-items: center;

        @include breakpoints.for-phone-only {
            gap: 8px;
        }

        #logo-text {
            #text {
                transition: all 0.2s ease-in-out;
                fill: var(--text-color);
                stroke: none;
                stroke-width: 0;
                font-size: 2.1em;
                font-family: 'Merriweather', serif;
            }
        }

        &:hover {
            #logo-text {
                filter: drop-shadow(0px 0px 3px var(--color--primary));
            }
        }
    }

    @media screen and (prefers-reduced-motion: no-preference) {
        .animated {
            #text {
                animation: svg-text-stroke 3s ease-in-out;
                --text-color: var(--color--primary);
            }
        }
    }
</style>
