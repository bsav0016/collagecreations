export const POST = "POST";
export const GET = "GET";
export const PUT = "PUT";
export const PATCH = "PATCH";
export const APPLICATION_JSON_HEADER: HeadersInit = { "Content-Type": "application/json" };
export const AUTHORIZATION_HEADER = (token: string): HeadersInit => ({
    Authorization: `Token ${token}`,
});
