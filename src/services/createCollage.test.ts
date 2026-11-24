import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCollage } from "./createCollage";
import { RequestRefusedError } from "../lib/requestRefused";
import { BACKEND_URL } from "../utils/constants/constants";
import { CollageCreationType } from "../pages/Customer/collageCreationPage/enums/collageCreationType";
import { OutputSize } from "../pages/Customer/collageCreationPage/enums/OutputSize";
import { SmallImageSize } from "../pages/Customer/collageCreationPage/enums/SmallImageSize";

// The form data is built from photos in the browser; what matters here is what is sent and how the answers are handled.
vi.mock("../dtos/collageDTO/newCollageDTO", () => ({
    NewCollageDTO: { fromVariables: () => ({ toFormData: async () => new FormData() }) },
}));

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

const DONE = {
    status: "done", temporary_image_id: "11111111-1111-1111-1111-111111111111", base_cost: 3000,
    watermark_collage: "abc", expires_at: "2026-12-01T00:00:00Z", requires_signin: false,
};

function start(options: { userToken?: string | null; customerToken?: string | null; onBusy?: (s: number) => void } = {}) {
    return createCollage(
        options.userToken ?? null, false, CollageCreationType.Text, OutputSize.x12x12, SmallImageSize.Small,
        [], undefined, [[true]], false, undefined, options.customerToken, options.onBusy,
    );
}

describe("createCollage", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("builds a collage and returns the result", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(json(202, { task_id: "t1" }))
            .mockResolvedValueOnce(json(201, DONE));
        const result = await start();
        expect(result.temporaryImageId).toBe(DONE.temporary_image_id);
    });

    it("sends a signed-in customer as one, so they get the higher limit, and staff as staff", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => json(202, { task_id: "t1" }));
        fetchMock.mockResolvedValueOnce(json(202, { task_id: "t1" })).mockResolvedValueOnce(json(201, DONE));
        await start({ customerToken: "cust" });
        expect((fetchMock.mock.calls[0][1]!.headers as Record<string, string>).Authorization).toBe("Customer cust");

        fetchMock.mockReset();
        fetchMock.mockResolvedValueOnce(json(202, { task_id: "t1" })).mockResolvedValueOnce(json(201, DONE));
        await start({ userToken: "staff", customerToken: "cust" });
        expect((fetchMock.mock.calls[0][1]!.headers as Record<string, string>).Authorization).toBe("Token staff");

        fetchMock.mockReset();
        fetchMock.mockResolvedValueOnce(json(202, { task_id: "t1" })).mockResolvedValueOnce(json(201, DONE));
        await start();
        expect(fetchMock.mock.calls[0][1]!.headers).toEqual({});
    });

    it("waits and tries again when the server is busy, telling the caller how long", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(json(503, { error: "busy", retry_after: 30 }, { "Retry-After": "30" }))
            .mockResolvedValueOnce(json(202, { task_id: "t1" }))
            .mockResolvedValueOnce(json(201, DONE));
        const onBusy = vi.fn();
        const pending = start({ onBusy });
        await vi.advanceTimersByTimeAsync(30_000);
        await pending;
        expect(onBusy).toHaveBeenCalledWith(30);
        expect(fetchMock.mock.calls[0][0]).toBe(`${BACKEND_URL}api/collage/`);
        expect(fetchMock.mock.calls[1][0]).toBe(`${BACKEND_URL}api/collage/`);
    });

    it("gives up with the busy message after three busy answers", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(async () => json(503, { error: "busy" }, { "Retry-After": "10" }));
        vi.spyOn(console, "error").mockImplementation(() => {});
        const pending = start();
        const outcome = pending.then(() => null, (error) => error);
        await vi.advanceTimersByTimeAsync(60_000);
        const error = await outcome;
        expect(error).toBeInstanceOf(RequestRefusedError);
        expect(error.message).toContain("very busy");
    });

    it("does not retry when the customer is going too fast (429)", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch")
            .mockImplementation(async () => json(429, { detail: "throttled" }, { "Retry-After": "3590" }));
        vi.spyOn(console, "error").mockImplementation(() => {});
        const error = await start().then(() => null, (e) => e);
        expect(error).toBeInstanceOf(RequestRefusedError);
        expect(error.status).toBe(429);
        expect(error.message).toContain("about an hour");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
