export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
export const STRIPE_KEY: string = import.meta.env.VITE_STRIPE_KEY;

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
