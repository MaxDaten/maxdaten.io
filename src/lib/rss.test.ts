import { describe, it, expect } from 'vitest';
import { GET } from '../routes/rss.xml/+server';

describe('RSS XML route', () => {
	it('should return valid RSS XML response', async () => {
		const response = await GET();
		
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/xml');
		expect(response.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
	});

	it('should return valid RSS XML structure', async () => {
		const response = await GET();
		const xml = await response.text();
		
		// Check RSS root element
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain('</rss>');
		
		// Check channel element
		expect(xml).toContain('<channel>');
		expect(xml).toContain('</channel>');
		
		// Check required RSS elements
		expect(xml).toContain('<title>');
		expect(xml).toContain('<link>');
		expect(xml).toContain('<description>');
		
		// Check atom:link for self-reference (note the double slash in URL)
		expect(xml).toContain('atom:link href="https://maxdaten.io//rss.xml" rel="self"');
	});

	it('should include blog posts as items', async () => {
		const response = await GET();
		const xml = await response.text();
		
		// Should contain at least one item element
		expect(xml).toContain('<item>');
		expect(xml).toContain('</item>');
		
		// Check for required item elements if items exist
		if (xml.includes('<item>')) {
			expect(xml).toContain('<guid>');
			expect(xml).toContain('<title>');
			expect(xml).toContain('<description>');
			expect(xml).toContain('<link>');
			expect(xml).toContain('<pubDate>');
			expect(xml).toContain('<content:encoded>');
		}
	});

	it('should have proper XML encoding and namespaces', async () => {
		const response = await GET();
		const xml = await response.text();
		
		// Check for proper XML namespaces
		expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
		expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
		
		// Check for CDATA sections in content:encoded
		expect(xml).toContain('<![CDATA[');
		expect(xml).toContain(']]>');
	});

	it('should include site image', async () => {
		const response = await GET();
		const xml = await response.text();
		
		expect(xml).toContain('<image>');
		// Note the double slash in the URL from siteBaseUrl
		expect(xml).toContain('<url>https://maxdaten.io//favicons/favicon-32x32.png</url>');
		expect(xml).toContain('<width>32</width>');
		expect(xml).toContain('<height>32</height>');
	});

	it('should properly escape XML entities in content', async () => {
		const response = await GET();
		const xml = await response.text();
		
		// Check that ampersands are properly escaped in regular XML content
		// (not inside CDATA sections)
		const xmlWithoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?]]>/g, '');
		
		// Should not contain unescaped ampersands outside CDATA
		const unescapedAmpersands = xmlWithoutCdata.match(/&(?!amp;|lt;|gt;|quot;|#39;)/g);
		expect(unescapedAmpersands).toBeNull();
		
		// Should properly escape common XML entities
		if (xmlWithoutCdata.includes('&amp;')) {
			expect(xmlWithoutCdata).not.toMatch(/&(?!amp;|lt;|gt;|quot;|#39;)/);
		}
	});
});