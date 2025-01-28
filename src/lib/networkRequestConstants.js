export const POST = "POST"
export const GET = "GET"
export const PUT = "PUT"
export const PATCH = "PATCH"
export const APPLICATION_JSON_HEADER = { 'Content-Type': 'application/json' }
export const AUTHORIZATION_HEADER = (token) => ({
    'Authorization': `Token ${token}`
});
