import { execSync } from 'node:child_process';

const listCandidates = [
    'vercel list --environment production -y --no-color 2>&1',
    'vercel list -y --no-color 2>&1',
];

let listOutput = '';
for (const command of listCandidates) {
    try {
        listOutput = execSync(command, { encoding: 'utf8' });
        if (listOutput.trim()) {
            break;
        }
    } catch (error) {
        const stderr = error?.stderr?.toString?.() ?? '';
        console.error(stderr.trim() || error.message);
    }
}

const match = listOutput.match(/[a-z0-9-]+\.vercel\.app/gi)?.[0];

if (!match) {
    console.error(
        'Could not detect the latest deployment URL from `vercel list` output.'
    );
    process.exit(1);
}

execSync(`vercel redeploy ${match} --target production`, { stdio: 'inherit' });
