import { createTransitionConfig } from 'ssgoi';
import crossfade from '#lib/transitions/crossfade.js';

export const transitionConfig = createTransitionConfig({
    transitions: [],
    defaultTransition: crossfade({ duration: 200 }),
});
