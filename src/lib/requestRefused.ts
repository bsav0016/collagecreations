// What the server says when it refuses a request for now, not for being wrong: 429 (too many requests from this
// address or account) and 503 (the collage worker is busy). Both come with a Retry-After, the number of seconds to wait.

export const TOO_MANY_REQUESTS = 429;
export const SERVICE_BUSY = 503;

/** "about 30 seconds", "about a minute", "about 3 minutes", "about an hour": a wait a customer can read. */
export function waitPhrase(seconds: number | null): string {
    if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return "a few minutes";
    if (seconds < 45) return `about ${Math.max(5, Math.round(seconds / 5) * 5)} seconds`;
    if (seconds < 90) return "about a minute";
    if (seconds < 3300) return `about ${Math.round(seconds / 60)} minutes`;
    if (seconds < 5400) return "about an hour";
    return `about ${Math.round(seconds / 3600)} hours`;
}

export function refusalMessage(status: number, retryAfterSeconds: number | null): string {
    const wait = waitPhrase(retryAfterSeconds);
    return status === SERVICE_BUSY
        ? `We're very busy right now. Please try again in ${wait}.`
        : `You're going a little fast. Please wait ${wait} and try again.`;
}

/** Seconds from a Retry-After header (whole seconds), else from the response body's `retry_after`, else null. */
export function parseRetryAfter(header: string | null, body?: unknown): number | null {
    const fromHeader = header === null ? NaN : Number.parseInt(header, 10);
    if (Number.isFinite(fromHeader) && fromHeader > 0) return fromHeader;
    const fromBody = (body as { retry_after?: unknown } | null | undefined)?.retry_after;
    return typeof fromBody === "number" && fromBody > 0 ? fromBody : null;
}

export class RequestRefusedError extends Error {
    status: number;
    retryAfterSeconds: number | null;

    constructor(status: number, retryAfterSeconds: number | null) {
        super(refusalMessage(status, retryAfterSeconds));
        this.name = "RequestRefusedError";
        this.status = status;
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

/** The text to show a customer for a failed request: the server's own message for a rejected one (the API words
 *  those for customers), the wait for a refused one, and `fallback` for anything else (network failures, 500s). */
export function friendlyErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof RequestRefusedError) return error.message;
    if (typeof error === "string" && error.trim() && error !== "Internal server error") return error;
    return fallback;
}

interface BusyRetryOptions {
    /** Total tries, including the first. */
    maxAttempts?: number;
    /** Longest single wait; a longer Retry-After gives up instead of waiting. */
    maxWaitSeconds?: number;
    /** Called before each wait with how many seconds it will be. */
    onWait?: (seconds: number, attempt: number) => void;
    sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs `run`, and when the server answers 503 (busy) waits as long as it asked and tries again. Anything else, and a
 *  429 (which can mean a wait of an hour), is passed straight to the caller. */
export async function retryWhenBusy<T>(run: () => Promise<T>, options: BusyRetryOptions = {}): Promise<T> {
    const { maxAttempts = 3, maxWaitSeconds = 180, onWait, sleep = realSleep } = options;
    for (let attempt = 1; ; attempt++) {
        try {
            return await run();
        } catch (error) {
            const busy = error instanceof RequestRefusedError && error.status === SERVICE_BUSY;
            if (!busy || attempt >= maxAttempts) throw error;
            const seconds = Math.min(error.retryAfterSeconds ?? 60, maxWaitSeconds);
            if ((error.retryAfterSeconds ?? 0) > maxWaitSeconds) throw error;
            onWait?.(seconds, attempt);
            await sleep(seconds * 1000);
        }
    }
}
