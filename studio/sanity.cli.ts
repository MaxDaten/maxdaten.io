import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    api: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    },
    studioHost: 'maxdaten',
    deployment: {
        appId: 'b51mlm1n98z4561inucc06y5',
    },
});
