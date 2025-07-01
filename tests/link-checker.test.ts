import { describe, it } from 'vitest';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join } from 'path';

describe.skipIf(process.env.VITEST_SKIP_SLOW === 'true')(
	'Blog Articles Link Checker',
	() => {
		it('should not have dead links in blog articles', async () => {
			// Find all blog article markdown files
			const blogFiles = await glob('src/routes/(blog-article)/**/*.md', {
				cwd: process.cwd()
			});

			console.log(`Checking links in ${blogFiles.length} blog articles...`);

			const deadLinks: { file: string; url: string; error: string }[] = [];
			const checkedUrls = new Map<string, boolean>(); // Cache for URL checks

			// Sites that commonly block automated requests but are generally reliable
			const allowlistedSites = [
				'notion.so',
				'oracle.com',
				'linkedin.com',
				'microsoft.com',
				'apple.com'
			];

			// Project URLs that might be temporarily down but are intentionally referenced
			const knownProjectSites = [
				'qwiz.buzz', // Personal project that might be temporarily offline
				'cv.maxdaten.io' // Personal CV site
			];

			const isAllowlisted = (url: string) => {
				return allowlistedSites.some((site) => url.includes(site));
			};

			const isKnownProject = (url: string) => {
				return knownProjectSites.some((site) => url.includes(site));
			};

			for (const file of blogFiles) {
				const content = readFileSync(join(process.cwd(), file), 'utf-8');

				// Extract URLs from markdown links [text](url) and direct URLs
				const linkRegex = /\[([^\]]*)]\(([^)]+)\)|https?:\/\/[^\s)]+/g;
				const matches = content.matchAll(linkRegex);

				for (const match of matches) {
					const url = match[2] || match[0]; // Use captured group or full match

					// Skip internal links, anchors, and mailto links
					if (
						url.startsWith('#') ||
						url.startsWith('/') ||
						url.startsWith('mailto:') ||
						url.startsWith('tel:') ||
						url.includes('localhost') ||
						url.includes('127.0.0.1')
					) {
						continue;
					}

					// Skip if we've already checked this URL
					if (checkedUrls.has(url)) {
						if (!checkedUrls.get(url)) {
							deadLinks.push({ file, url, error: 'Previously failed check' });
						}
						continue;
					}

					// Skip allowlisted sites that commonly block automation
					if (isAllowlisted(url)) {
						console.log(`Skipping allowlisted site: ${url}`);
						checkedUrls.set(url, true);
						continue;
					}

					try {
						console.log(`Checking: ${url}`);

						// Use fetch with timeout and proper headers
						const controller = new AbortController();
						const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

						const response = await fetch(url, {
							method: 'HEAD', // Use HEAD to avoid downloading full content
							signal: controller.signal,
							headers: {
								'User-Agent':
									'Mozilla/5.0 (compatible; Link-Checker/1.0; +https://maxdaten.io)',
								Accept: '*/*'
							}
						});

						clearTimeout(timeoutId);

						if (!response.ok) {
							// Some sites block HEAD requests, try GET
							if (response.status === 405) {
								const getResponse = await fetch(url, {
									method: 'GET',
									signal: controller.signal,
									headers: {
										'User-Agent':
											'Mozilla/5.0 (compatible; Link-Checker/1.0; +https://maxdaten.io)',
										Accept:
											'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
									}
								});

								if (!getResponse.ok) {
									deadLinks.push({
										file,
										url,
										error: `HTTP ${getResponse.status}: ${getResponse.statusText}`
									});
									checkedUrls.set(url, false);
								} else {
									checkedUrls.set(url, true);
								}
							} else {
								deadLinks.push({
									file,
									url,
									error: `HTTP ${response.status}: ${response.statusText}`
								});
								checkedUrls.set(url, false);
							}
						} else {
							checkedUrls.set(url, true);
						}

						// Rate limiting: wait 100ms between requests
						await new Promise((resolve) => setTimeout(resolve, 100));
					} catch (error) {
						const errorMessage =
							error instanceof Error ? error.message : 'Unknown error';

						// If it's a known project site, just warn but don't fail the test
						if (isKnownProject(url)) {
							console.warn(
								`Warning: Known project site ${url} is unreachable - ${errorMessage}`
							);
							checkedUrls.set(url, true); // Mark as "okay" since it's a known project
						} else {
							deadLinks.push({ file, url, error: errorMessage });
							checkedUrls.set(url, false);
						}

						// Rate limiting for failed requests too
						await new Promise((resolve) => setTimeout(resolve, 200));
					}
				}
			}

			// Report results
			if (deadLinks.length > 0) {
				console.error('\n❌ Dead links found:');
				deadLinks.forEach(({ file, url, error }) => {
					console.error(`  ${file}: ${url} - ${error}`);
				});

				// Group by file for better readability
				const linksByFile = deadLinks.reduce(
					(acc, { file, url, error }) => {
						if (!acc[file]) acc[file] = [];
						acc[file].push({ url, error });
						return acc;
					},
					{} as Record<string, { url: string; error: string }[]>
				);

				let errorMessage = '\nDead links found in blog articles:\n\n';
				Object.entries(linksByFile).forEach(([file, links]) => {
					errorMessage += `📄 ${file}:\n`;
					links.forEach(({ url, error }) => {
						errorMessage += `  ❌ ${url} - ${error}\n`;
					});
					errorMessage += '\n';
				});

				throw new Error(errorMessage);
			}

			console.log('✅ All links are working correctly!');
		}, 120000); // 2 minute timeout for the entire test
	}
);
