import { afterEach, describe, expect, it, vi } from "vitest";
import NetworkRequest from "./networkClient";
import { BACKEND_URL } from "../utils/constants/constants";

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
        reply(429, { detail: "Request was throttled." });
        vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(NetworkRequest({ urlExtension: "x/", method: "POST" })).rejects.toEqual({
            detail: "Request was throttled.",
        });
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
