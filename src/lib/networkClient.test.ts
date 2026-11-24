import { afterEach, describe, expect, it, vi } from "vitest";
import NetworkRequest, { NetworkFileRequest } from "./networkClient";
import { BACKEND_URL } from "../utils/constants/constants";
import { RequestRefusedError } from "./requestRefused";

const reply = (status: number, body: unknown) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
    );

afterEach(() => vi.unstubAllGlobals());

describe("NetworkRequest", () => {
    it("calls the backend with the method, headers and body it was given", async () => {
        const fetchMock = reply(200, { ok: true });

        await NetworkRequest({
            urlExtension: "api/payment/",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: '{"a":1}',
        });

        expect(fetchMock).toHaveBeenCalledWith(`${BACKEND_URL}api/payment/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: '{"a":1}',
        });
    });

    it.each([200, 201, 202])("returns the parsed body for a %i response", async (status) => {
        reply(status, { id: 7 });

        const result = await NetworkRequest<{ id: number }>({ urlExtension: "x/", method: "GET" });

        expect(result).toEqual({ status, data: { id: 7 } });
    });

    it("throws the API's error message when a request is rejected", async () => {
        reply(400, { error: "ZIP code must be 5 digits" });
        vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(NetworkRequest({ urlExtension: "x/", method: "POST" })).rejects.toBe("ZIP code must be 5 digits");
    });

    it("throws the whole body when a rejection has no error field", async () => {
        reply(401, { detail: "Invalid token." });
        vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(NetworkRequest({ urlExtension: "x/", method: "POST" })).rejects.toEqual({
            detail: "Invalid token.",
        });
    });

    it("throws a RequestRefusedError, with the wait from Retry-After, when the server says slow down (429)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ detail: "Request was throttled." }), {
                status: 429, headers: { "Content-Type": "application/json", "Retry-After": "3590" },
            }),
        );
        vi.spyOn(console, "error").mockImplementation(() => {});

        const error = await NetworkRequest({ urlExtension: "x/", method: "POST" }).catch((e) => e);
        expect(error).toBeInstanceOf(RequestRefusedError);
        expect(error).toMatchObject({ status: 429, retryAfterSeconds: 3590 });
        expect(error.message).toContain("about an hour");
        // The sign-in checks elsewhere look for a `detail` field to mean a stale login; a throttled request is not one.
        expect(error.detail).toBeUndefined();
    });

    it("throws a RequestRefusedError, with the wait from the body, when the server is busy (503)", async () => {
        reply(503, { error: "We are very busy right now.", retry_after: 75 });
        vi.spyOn(console, "error").mockImplementation(() => {});

        const error = await NetworkRequest({ urlExtension: "x/", method: "POST" }).catch((e) => e);
        expect(error).toBeInstanceOf(RequestRefusedError);
        expect(error).toMatchObject({ status: 503, retryAfterSeconds: 75 });
        expect(error.message).toContain("very busy");
    });

    it.each([301, 404, 500])("does not treat a %i response as success", async (status) => {
        reply(status, { error: "nope" });
        vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(NetworkRequest({ urlExtension: "x/", method: "GET" })).rejects.toBe("nope");
    });

    it("passes network failures through to the caller", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

        await expect(NetworkRequest({ urlExtension: "x/", method: "GET" })).rejects.toThrow("Failed to fetch");
    });
});

describe("NetworkFileRequest", () => {
    it("returns the file for a successful answer", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("jpeg-bytes", { status: 200 }));

        const blob = await NetworkFileRequest("api/download/abc/");

        expect(fetchMock).toHaveBeenCalledWith(`${BACKEND_URL}api/download/abc/`);
        expect(blob.size).toBe("jpeg-bytes".length);
    });

    it("throws when the link is not valid", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 400 }));

        await expect(NetworkFileRequest("api/download/bad/")).rejects.toThrow("400");
    });
});
