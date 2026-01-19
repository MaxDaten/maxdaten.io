import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '$routes/rss.xml/+server';

// Mock the Sanity client
vi.mock('$lib/sanity/client', () => ({
    client: {
        fetch: vi.fn().mockResolvedValue([
            {
                slug: '2023-12-11-deploy-sops-secrets-with-nix',
                title: 'Deploy SOPS Secrets with Nix',
                excerpt: 'How to manage secrets like private ssh keys',
                date: '2023-12-11',
                tags: [{ name: 'nix' }, { name: 'secrets' }],
                body: [
                    {
                        _type: 'block',
                        _key: 'block1',
                        style: 'normal',
                        markDefs: [],
                        children: [
                            {
                                _type: 'span',
                                _key: 'span1',
                                marks: [],
                                text: 'Test content for RSS feed.',
                            },
                        ],
                    },
                ],
                coverImage: {
                    url: 'https://cdn.sanity.io/images/test.jpg',
                },
            },
            {
                slug: '2024-05-15-telepresence',
                title: 'Telepresence & GKE',
                excerpt: 'Local development with Kubernetes',
                date: '2024-05-15',
                tags: [{ name: 'kubernetes' }],
                body: [
                    {
                        _type: 'block',
                        _key: 'block2',
                        style: 'normal',
                        markDefs: [],
                        children: [
                            {
                                _type: 'span',
                                _key: 'span2',
                                marks: [],
                                text: 'Another test content.',
                            },
                        ],
                    },
                ],
            },
        ]),
    },
}));

describe('RSS XML route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return valid RSS XML response', async () => {
        const response = await GET();

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/xml');
        expect(response.headers.get('Cache-Control')).toBe(
            'max-age=0, s-maxage=3600'
        );
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

        // Check atom:link for self-reference
        expect(xml).toContain(
            'atom:link href="https://maxdaten.io/rss.xml" rel="self"'
        );
    });

    it('should include blog posts as items', async () => {
        const response = await GET();
        const xml = await response.text();

        // Should contain at least one item element
        expect(xml).toContain('<item>');
        expect(xml).toContain('</item>');

        // Check for required item elements
        expect(xml).toContain('<guid>');
        expect(xml).toContain('<title>');
        expect(xml).toContain('<description>');
        expect(xml).toContain('<link>');
        expect(xml).toContain('<pubDate>');
        expect(xml).toContain('<content:encoded>');
    });

    it('should have proper XML encoding and namespaces', async () => {
        const response = await GET();
        const xml = await response.text();

        // Check for proper XML namespaces
        expect(xml).toContain(
            'xmlns:content="http://purl.org/rss/1.0/modules/content/"'
        );
        expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');

        // Check for CDATA sections in content:encoded
        expect(xml).toContain('<![CDATA[');
        expect(xml).toContain(']]>');
    });

    it('should include site image', async () => {
        const response = await GET();
        const xml = await response.text();

        expect(xml).toContain('<image>');
        expect(xml).toContain(
            '<url>https://maxdaten.io/favicons/favicon-32x32.png</url>'
        );
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
        const unescapedAmpersands = xmlWithoutCdata.match(
            /&(?!amp;|lt;|gt;|quot;|#39;)/g
        );
        expect(unescapedAmpersands).toBeNull();
    });

    it('should include specific blog post slug and content', async () => {
        const response = await GET();
        const xml = await response.text();

        // Check for specific post slug
        expect(xml).toContain('2023-12-11-deploy-sops-secrets-with-nix');

        // Check for post content (now plain text from Portable Text)
        expect(xml).toContain('Test content for RSS feed');
    });
});
