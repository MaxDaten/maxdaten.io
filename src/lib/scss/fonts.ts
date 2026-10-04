/**
 * Fonts, from the @fontsource packages. Import this file in +layout.svelte to load them.
 *
 * fonts.css declares the latin faces only; `fontPreloads` lists the same files so the layout can
 * preload them (all three render above the fold: body copy, headlines and readouts).
 */

// Inter Variable: body text. Space Grotesk Variable: logo and headlines. JetBrains Mono 400:
// metadata readouts.
import './fonts.css';

import inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import spaceGrotesk from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url';
import jetbrainsMono from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url';

export const fontPreloads = [inter, spaceGrotesk, jetbrainsMono];
