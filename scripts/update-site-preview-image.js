import { chromium } from 'playwright';

(async () => {
	let browser = await chromium.launch();

	let page = await browser.newPage();
	await page.setViewportSize({ width: 2574 / 2, height: 2444 / 2 });
	await page.goto('http://localhost:5173');
	await page.screenshot({ path: `static/images/site-preview.png` });
	await browser.close();
})();
