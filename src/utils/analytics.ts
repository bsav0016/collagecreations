// Privacy-friendly visitor counting. Off unless a provider and site id are set at build time, and only in production builds,
// so local runs and tests never report. Both supported providers are cookieless and keep no personal profile; they count
// page views (the single-page app's route changes included) and read utm_source / utm_medium / utm_campaign from the address.

export type AnalyticsProvider = 'umami' | 'plausible';

export interface AnalyticsConfig {
    provider?: string;
    siteId?: string;
    /** Optional override of the script address, for a self-hosted instance. */
    src?: string;
}

export interface AnalyticsScript {
    src: string;
    attributes: Record<string, string>;
}

const DEFAULT_SRC: Record<AnalyticsProvider, string> = {
    umami: 'https://cloud.umami.is/script.js',
    plausible: 'https://plausible.io/js/script.js',
};

const SITE_ID_ATTRIBUTE: Record<AnalyticsProvider, string> = {
    umami: 'data-website-id',
    plausible: 'data-domain',
};

/** The script tag to add, or null when analytics is not (fully) configured. */
export function analyticsScript(config: AnalyticsConfig): AnalyticsScript | null {
    const provider = config.provider?.trim().toLowerCase();
    const siteId = config.siteId?.trim();
    if (!siteId || (provider !== 'umami' && provider !== 'plausible')) return null;
    const src = config.src?.trim() || DEFAULT_SRC[provider];
    if (!/^https:\/\//.test(src)) return null;
    const attributes: Record<string, string> = { [SITE_ID_ATTRIBUTE[provider]]: siteId };
    // Skip visitors whose browser says Do Not Track.
    if (provider === 'umami') attributes['data-do-not-track'] = 'true';
    return { src, attributes };
}

/** Adds the script to the page once. Returns whether it did. */
export function installAnalytics(config: AnalyticsConfig, doc: Document = document): boolean {
    const script = analyticsScript(config);
    if (!script || doc.querySelector('script[data-analytics]')) return false;
    const element = doc.createElement('script');
    element.defer = true;
    element.src = script.src;
    element.setAttribute('data-analytics', '');
    for (const [name, value] of Object.entries(script.attributes)) element.setAttribute(name, value);
    doc.head.appendChild(element);
    return true;
}
