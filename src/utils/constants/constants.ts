export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
export const STRIPE_KEY: string = import.meta.env.VITE_STRIPE_KEY;
export const SENTRY_DSN: string = import.meta.env.VITE_SENTRY_DSN;
// Public OAuth application IDs (not secrets) for customer sign-in.
export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID
    || '72702044941-ksln6otl4bd7skli3nsrier273v8tm40.apps.googleusercontent.com';
export const MICROSOFT_CLIENT_ID: string = import.meta.env.VITE_MICROSOFT_CLIENT_ID
    || 'f63a5e1b-bc83-4766-83e0-601397fee1fc';

export const userAgent: string = window.navigator.userAgent;
export const IS_DESKTOP: boolean = /Windows NT|Macintosh|Linux x86_64|Linux i686/.test(userAgent);

interface Margins {
    VERY_SMALL: string;
    SMALL: string;
    MEDIUM: string;
    LARGE: string;
    VERY_LARGE: string;
}

export const MARGINS: Margins = {
    VERY_SMALL: '3px',
    SMALL: '6px',
    MEDIUM: '10px',
    LARGE: '15px',
    VERY_LARGE: '20px'
};
