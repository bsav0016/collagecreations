import { afterEach, describe, expect, it, vi } from "vitest";
import PartnerService from "./PartnerService";
import { BACKEND_URL } from "../utils/constants/constants";

const reply = (status: number, body: unknown) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
    );

afterEach(() => vi.restoreAllMocks());

describe("PartnerService", () => {
    it("asks for a code without any token", async () => {
        const fetchMock = reply(200, { message: "ok" });
        await PartnerService.requestCode("o@petal.com");
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(`${BACKEND_URL}api/partner/email/request/`);
        expect(init!.method).toBe("POST");
        expect(JSON.parse(init!.body as string)).toEqual({ email: "o@petal.com" });
        expect((init!.headers as Record<string, string>).Authorization).toBeUndefined();
    });

    it("sends the Partner token (never Token or Customer) when reading data", async () => {
        const fetchMock = reply(200, { count: 0, results: [] });
        await PartnerService.getCommissions("tok", 2);
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(`${BACKEND_URL}api/partner/commissions/?page=2`);
        expect((init!.headers as Record<string, string>).Authorization).toBe("Partner tok");
    });

    it("turns the server's detail into the error message", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        reply(400, { detail: "That code is invalid or has expired." });
        await expect(PartnerService.verifyCode("o@petal.com", "1")).rejects.toThrow("That code is invalid or has expired.");
    });

    it("falls back to a plain message when the server gives none", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        reply(500, {});
        await expect(PartnerService.getSummary("tok")).rejects.toThrow("Could not load your totals.");
    });
});
