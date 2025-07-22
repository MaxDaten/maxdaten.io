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
            dominant-baseline="hanging">maxdaten.io</text
        >
    </svg>
</div>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .logo {
        #logo-text {
            #text {
                --text-color: var(--color--primary);
                transition: all 0.2s ease-in-out;
                fill: var(--text-color);
                stroke: none;
                stroke-width: 0;
                stroke-linecap: round;
                font-size: 2.1em;
                font-family: var(--font-logo), sans-serif;
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
                animation: svg-text-stroke 2s ease-in-out;
                --text-color: var(--color--primary);
            }
        }
    }
</style>
