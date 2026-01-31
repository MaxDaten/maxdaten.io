/**
 * Font imports using @fontsource packages.
 * Import this file in +layout.svelte to load fonts.
 *
 * Previously, fonts were loaded via SCSS using @fontsource-utils/scss.
 * This approach uses the JavaScript imports which inject the CSS automatically.
 */

// Inter Variable - primary font
// Weights: 500, 600, 700
import '@fontsource-variable/inter/wght.css';

// JetBrains Mono - monospace font
// Weight: 400
import '@fontsource/jetbrains-mono/400.css';

// Space Grotesk Variable - logo font
import '@fontsource-variable/space-grotesk/wght.css';
