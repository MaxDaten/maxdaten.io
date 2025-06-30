import { expect, test, describe } from 'vitest';
import { HttpRegex } from './regex';

describe('HTTP Regex', () => {
	test('validates URLs starting with http or https', () => {
		const validUrls = [
			'https://example.com',
			'http://localhost:3000',
			'https://sub.domain.com/path?query=value',
			'http://example.com'
		];

		validUrls.forEach((url) => {
			expect(HttpRegex.test(url)).toBe(true);
		});
	});

	test('rejects URLs not starting with http or https', () => {
		const invalidUrls = [
			'ftp://example.com',
			'example.com',
			'www.example.com',
			'mailto:test@example.com'
		];

		invalidUrls.forEach((url) => {
			expect(HttpRegex.test(url)).toBe(false);
		});
	});
});
