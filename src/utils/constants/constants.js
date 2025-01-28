export const DEV_ENVIRONMENT = true;

export const BACKEND_URL = DEV_ENVIRONMENT
  ? "http://127.0.0.1:8000/"
  : "https://collage-creations-a2decf2a69e5.herokuapp.com/";

export const STRIPE_KEY = DEV_ENVIRONMENT
  ? 'pk_test_51K3Z43KQPt6SvxbCq2DWQAxjj2fSskBhazWMiBI4WM6XRgOoDUSckkHxZzWaSXgIO55qf3EAi0lo2X4iab44nHIl00amJ9PVxZ'
  : 'pk_live_51K3Z43KQPt6SvxbCYjiFsRWquBwI7abgPdxwRC4Qlma9myzEzKUwr0uCIc3URtyIF9O4Xkxws9fSyusrbr0aU22x00BOzYDqU7';

export const userAgent = window.navigator.userAgent;
export const IS_DESKTOP = /Windows NT|Macintosh|Linux x86_64|Linux i686/.test(userAgent);

export const MARGINS = {
  VERY_SMALL: '3px',
  SMALL: '6px',
  MEDIUM: '10px',
  LARGE: '15px',
  VERY_LARGE: '20px'
};