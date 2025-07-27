export const prerender = true;

export async function GET({ url }): Promise<Response> {
    // prettier-ignore
    const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${url.origin}/sitemap.xml`
	].join('\n').trim();

    const headers = {
        'Content-Type': 'text/plain',
    };

    return new Response(body, { headers });
}
