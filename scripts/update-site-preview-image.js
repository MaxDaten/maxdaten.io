import { chromium } from 'playwright';
import { spawn } from 'child_process';

(async () => {
    const npm = spawn('npm', ['run', 'dev']);

    // Wait for dev server to start
    await new Promise((resolve) => setTimeout(resolve, 5000));

    let browser;
    try {
        browser = await chromium.launch();

        let page = await browser.newPage({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 2574 / 2, height: 2444 / 2 });
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        await page.screenshot({ path: `static/images/site-preview.png` });
    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        if (browser) await browser.close();
        npm.kill();
        process.exit();
    }
})();
