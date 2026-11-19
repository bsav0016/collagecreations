import { describe, expect, it } from 'vitest';
import template from '../../index.html?raw';
import robots from '../../public/robots.txt?raw';
import routes from '../routes/customerRoutes.tsx?raw';
import { PUBLIC_ROUTES, SITE_URL, buildSitemap, renderRouteHtml, routeUrl } from './seo';

const tips = PUBLIC_ROUTES.find((route) => route.path === 'tips')!;

describe('renderRouteHtml', () => {
    it('gives a page its own title, description and canonical address', () => {
        const html = renderRouteHtml(template, tips);
        expect(html).toContain(`<title>${tips.title}</title>`);
        expect(html).toContain(`content="${tips.description}"`);
        expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/tips/" />`);
        expect(html).toContain(`<meta property="og:url" content="${SITE_URL}/tips/" />`);
        expect(html.match(/<title>/g)).toHaveLength(1);
        expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    });

    it('keeps the app: the bundle script and the root element are untouched', () => {
        const html = renderRouteHtml(template, tips);
        expect(html).toContain('<div id="root"></div>');
        expect(html).toContain('src="/src/index.tsx"');
    });

    it('escapes anything that would break an attribute', () => {
        const html = renderRouteHtml(template, { path: 'x', title: 'A & "B" <c>', description: 'say "hi" & <go>' });
        expect(html).toContain('<title>A &amp; &quot;B&quot; &lt;c></title>');
        expect(html).toContain('content="say &quot;hi&quot; &amp; &lt;go>"');
    });

    it('refuses a template it cannot update, instead of publishing the wrong head', () => {
        expect(() => renderRouteHtml('<html><head></head></html>', tips)).toThrow();
    });
});

describe('the public routes', () => {
    it('start with the home page and have unique paths, titles and descriptions', () => {
        expect(PUBLIC_ROUTES[0].path).toBe('');
        for (const key of ['path', 'title', 'description'] as const) {
            expect(new Set(PUBLIC_ROUTES.map((route) => route[key])).size).toBe(PUBLIC_ROUTES.length);
        }
    });

    it('have titles and descriptions of a useful length for search results', () => {
        for (const route of PUBLIC_ROUTES) {
            expect(route.title.length).toBeLessThanOrEqual(70);
            expect(route.description.length).toBeGreaterThan(20);
            expect(route.description.length).toBeLessThanOrEqual(170);
        }
    });

    it('are all real routes in the customer router', () => {
        for (const route of PUBLIC_ROUTES.filter((r) => r.path)) {
            expect(routes).toContain(`path="${route.path}"`);
        }
    });

    it('never list a page robots.txt keeps out of search', () => {
        const blocked = [...robots.matchAll(/^Disallow: (\S+)/gm)].map((m) => m[1]);
        for (const route of PUBLIC_ROUTES) {
            const url = `/${route.path}`;
            expect(blocked.some((prefix) => url.startsWith(prefix) && prefix !== '/')).toBe(false);
        }
        expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    });
});

describe('buildSitemap', () => {
    it('lists every public page once, with the address search engines should use', () => {
        const sitemap = buildSitemap();
        for (const route of PUBLIC_ROUTES) expect(sitemap).toContain(`<loc>${routeUrl(route)}</loc>`);
        expect(sitemap.match(/<loc>/g)).toHaveLength(PUBLIC_ROUTES.length);
        expect(sitemap).toContain(`<loc>${SITE_URL}/</loc>`);
    });
});
