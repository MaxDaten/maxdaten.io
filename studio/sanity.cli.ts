import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    api: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'hvsy54ho',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    },
    // Pin the Studio's own tsconfig: Vite 8 otherwise falls back to the repo root's, which
    // extends SvelteKit's $app/tsconfig and cannot resolve when only studio/ is installed.
    vite: { tsconfig: './tsconfig.json' },
    deployment: {
        appId: 'b51mlm1n98z4561inucc06y5',
    },
});
