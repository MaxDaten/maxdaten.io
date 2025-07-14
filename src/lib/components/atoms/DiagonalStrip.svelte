<script lang="ts">
    let { stroke = '#ff8000', strokeWidth = '1' } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
        <pattern
            id="pattern_xvi1B"
            patternUnits="userSpaceOnUse"
            width="5.5"
            height="5.5"
            patternTransform="rotate(45)"
        >
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="5.5"
                {stroke}
                stroke-width={strokeWidth}
            />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pattern_xvi1B)" opacity="1" />
</svg>
