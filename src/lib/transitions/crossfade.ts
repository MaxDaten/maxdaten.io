const out = 'position: absolute; left: 0px; top: 0px; width: 100%;';

const crossfade = ({
    duration,
    delay,
    easing,
}: {
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
} = {}) => ({
    in() {
        return {
            duration,
            delay,
            easing,
            css(t: number) {
                return `opacity: ${t};`;
            },
        };
    },
    out() {
        return {
            duration,
            delay,
            easing,
            css(t: number) {
                return `${out} opacity: ${t};`;
            },
        };
    },
});

export default crossfade;
