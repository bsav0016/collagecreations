// Search-engine plumbing for the static GitHub Pages host. Pure functions, used by the build plugin in vite.config.ts.
//
// Why this exists: the site is a single-page app on GitHub Pages. GitHub answers any path it has no file for with HTTP 404
// (and public/404.html then redirects in the browser). A search engine treats a 404 as "no page", so only the home page was
// indexable. The build now writes a real file for each public page (build/tips/index.html and so on), so GitHub answers 200,
// with its own title, description and canonical address. The app still boots from the same bundle and the router shows
// the page, exactly as before.

export const SITE_URL = 'https://collagecreations.org';

export interface PublicRoute {
    /** The path without slashes, as in the router: "tips". The home page is "". */
    path: string;
    title: string;
    description: string;
}

// Only pages that make sense in search results. Ordering and checkout pages are deliberately absent (see robots.txt).
export const PUBLIC_ROUTES: PublicRoute[] = [
    {
        path: '',
        title: 'Collage Creations - Create Stunning Photo Collages | Collage Creations',
        description:
            'Create stunning photo collages using hundreds of your own pictures. Turn images, words, or symbols into high-resolution collages. Order custom prints today.',
    },
    {
        path: 'tips',
        title: 'Photo Mosaic Tips: Image, Text and Symbol Collages | Collage Creations',
        description: 'Helpful tips for creating image-based, text-based and symbol-based photo mosaics and getting the best result from your pictures.',
    },
    {
        path: 'support',
        title: 'Support | Collage Creations',
        description: 'Get help with a Collage Creations order, a download or a problem with your collage.',
    },
    {
        path: 'custom-order',
        title: 'Custom Photo Collage Orders | Collage Creations',
        description: 'Ask for a custom photo collage order: tell us what you have in mind and we will get back to you.',
    },
    {
        path: 'terms',
        title: 'Terms of Service | Collage Creations',
        description: 'The terms for using Collage Creations.',
    },
    {
        path: 'privacy',
        title: 'Privacy Policy | Collage Creations',
        description: 'How Collage Creations collects, uses and protects your information.',
    },
    {
        path: 'refund-policy',
        title: 'Refund Policy | Collage Creations',
        description: 'When and how Collage Creations refunds an order.',
    },
];

const escapeAttribute = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The address of a route, with a trailing slash for every page except the home page's own root. */
export function routeUrl(route: PublicRoute): string {
    return route.path ? `${SITE_URL}/${route.path}/` : `${SITE_URL}/`;
}

/**
 * The built index.html with this route's title, description and canonical address. Throws if the template has changed in a
 * way that makes the replacement a silent no-op, so a build never publishes a page with the wrong head.
 */
export function renderRouteHtml(template: string, route: PublicRoute): string {
    const title = /<title>[\s\S]*?<\/title>/;
    const description = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;
    if (!title.test(template) || !description.test(template)) {
        throw new Error('index.html has no <title> or meta description to replace');
    }
    const canonical = `<link rel="canonical" href="${routeUrl(route)}" />`;
    return template
        .replace(title, () => `<title>${escapeAttribute(route.title)}</title>`)
        .replace(description, () => `<meta name="description" content="${escapeAttribute(route.description)}" />\n        ${canonical}`)
        .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, () => `<meta property="og:title" content="${escapeAttribute(route.title)}" />`)
        .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, () => `<meta property="og:url" content="${routeUrl(route)}" />`);
}

export function buildSitemap(routes: PublicRoute[] = PUBLIC_ROUTES): string {
    const urls = routes.map((route) => `  <url><loc>${routeUrl(route)}</loc></url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
