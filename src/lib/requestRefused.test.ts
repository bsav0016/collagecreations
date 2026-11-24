import { describe, expect, it, vi } from "vitest";
import {
    friendlyErrorMessage,
    parseRetryAfter,
    refusalMessage,
    RequestRefusedError,
    retryWhenBusy,
    waitPhrase,
} from "./requestRefused";

describe("waitPhrase", () => {
    it.each([
        [null, "a few minutes"],
        [0, "a few minutes"],
        [Number.NaN, "a few minutes"],
        [3, "about 5 seconds"],
        [30, "about 30 seconds"],
        [44, "about 45 seconds"],
        [60, "about a minute"],
        [89, "about a minute"],
        [120, "about 2 minutes"],
        [600, "about 10 minutes"],
        [3590, "about an hour"],
        [7200, "about 2 hours"],
    ])("%s seconds reads as %s", (seconds, phrase) => {
        expect(waitPhrase(seconds as number | null)).toBe(phrase);
    });
});

describe("messages", () => {
    it("tells a busy customer to try again and a throttled one to slow down", () => {
        expect(refusalMessage(503, 120)).toBe("We're very busy right now. Please try again in about 2 minutes.");
        expect(refusalMessage(429, 3590)).toBe("You're going a little fast. Please wait about an hour and try again.");
        expect(refusalMessage(503, null)).toContain("a few minutes");
    });

    it("shows the API's own message for a rejected request, the wait for a refused one, and the fallback otherwise", () => {
        expect(friendlyErrorMessage("That image is too large; try one with fewer pixels", "x")).toBe(
            "That image is too large; try one with fewer pixels",
        );
        expect(friendlyErrorMessage(new RequestRefusedError(503, 60), "x")).toContain("very busy");
        expect(friendlyErrorMessage("Internal server error", "Could not do it")).toBe("Could not do it");
        expect(friendlyErrorMessage("   ", "fallback")).toBe("fallback");
        expect(friendlyErrorMessage(new TypeError("Failed to fetch"), "fallback")).toBe("fallback");
        expect(friendlyErrorMessage({ detail: "Invalid token." }, "fallback")).toBe("fallback");
        expect(friendlyErrorMessage(undefined, "fallback")).toBe("fallback");
    });
});

describe("parseRetryAfter", () => {
    it("prefers the header, falls back to the body, and refuses nonsense", () => {
        expect(parseRetryAfter("90", { retry_after: 10 })).toBe(90);
        expect(parseRetryAfter(null, { retry_after: 75 })).toBe(75);
        expect(parseRetryAfter("soon", { retry_after: 75 })).toBe(75);
        expect(parseRetryAfter("0", null)).toBeNull();
        expect(parseRetryAfter(null, { retry_after: "10" })).toBeNull();
        expect(parseRetryAfter(null, undefined)).toBeNull();
    });
});

describe("retryWhenBusy", () => {
    const busy = (seconds: number | null = 30) => new RequestRefusedError(503, seconds);
    const noSleep = () => vi.fn(async () => {});

    it("returns the first success without waiting", async () => {
        const sleep = noSleep();
        await expect(retryWhenBusy(async () => "ok", { sleep })).resolves.toBe("ok");
        expect(sleep).not.toHaveBeenCalled();
    });

    it("waits as long as the server asked after a 503, tells the caller, and tries again", async () => {
        const run = vi.fn().mockRejectedValueOnce(busy(45)).mockResolvedValueOnce("ok");
        const sleep = noSleep();
        const onWait = vi.fn();
        await expect(retryWhenBusy(run, { sleep, onWait })).resolves.toBe("ok");
        expect(sleep).toHaveBeenCalledWith(45_000);
        expect(onWait).toHaveBeenCalledWith(45, 1);
        expect(run).toHaveBeenCalledTimes(2);
    });

    it("waits a minute when no Retry-After came with the 503", async () => {
        const run = vi.fn().mockRejectedValueOnce(busy(null)).mockResolvedValueOnce("ok");
        const sleep = noSleep();
        await retryWhenBusy(run, { sleep });
        expect(sleep).toHaveBeenCalledWith(60_000);
    });

    it("gives up after the last attempt and throws the 503", async () => {
        const error = busy();
        const run = vi.fn().mockRejectedValue(error);
        await expect(retryWhenBusy(run, { sleep: noSleep(), maxAttempts: 3 })).rejects.toBe(error);
        expect(run).toHaveBeenCalledTimes(3);
    });

    it("does not wait out a request to come back much later", async () => {
        const error = busy(900);
        const run = vi.fn().mockRejectedValue(error);
        const sleep = noSleep();
        await expect(retryWhenBusy(run, { sleep, maxWaitSeconds: 180 })).rejects.toBe(error);
        expect(sleep).not.toHaveBeenCalled();
        expect(run).toHaveBeenCalledTimes(1);
    });

    it("never retries a 429, an API rejection or a network failure", async () => {
        for (const error of [new RequestRefusedError(429, 3000), "Unsupported size", new TypeError("Failed to fetch")]) {
            const run = vi.fn().mockRejectedValue(error);
            const sleep = noSleep();
            await expect(retryWhenBusy(run, { sleep })).rejects.toBe(error);
            expect(run).toHaveBeenCalledTimes(1);
            expect(sleep).not.toHaveBeenCalled();
        }
    });
});
