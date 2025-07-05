import { createTransitionConfig } from 'ssgoi';
import crossfade from '$lib/transitions/crossfade';

export const transitionConfig = createTransitionConfig({
    transitions: [],
    defaultTransition: crossfade({ duration: 200 }),
});
