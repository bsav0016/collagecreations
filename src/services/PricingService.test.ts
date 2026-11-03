import { afterEach, describe, expect, it, vi } from "vitest";
import PricingService from "./PricingService";
import { BACKEND_URL } from "../utils/constants/constants";

const reply = (status: number, body: unknown) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
    );

afterEach(() => vi.restoreAllMocks());

describe("PricingService", () => {
    it("sends the admin token when reading prices", async () => {
        const fetchMock = reply(200, { can_edit: false, catalog: [] });
        await PricingService.getPricing("tok");
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(`${BACKEND_URL}api/admin/pricing/`);
        expect((init!.headers as Record<string, string>).Authorization).toBe("Token tok");
    });

    it("updates one catalog item with a PUT of cents", async () => {
        const fetchMock = reply(200, { warnings: [] });
        await PricingService.updateCatalogItem("tok", 7, { price_cents: 5000, active: true });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(`${BACKEND_URL}api/admin/pricing/catalog/7/`);
        expect(init!.method).toBe("PUT");
        expect(JSON.parse(init!.body as string)).toEqual({ price_cents: 5000, active: true });
    });

    it("returns the history list", async () => {
        reply(200, { history: [{ id: 1, user: "boss" }] });
        expect(await PricingService.getHistory("tok")).toEqual([{ id: 1, user: "boss" }]);
    });

    it("surfaces a rejected edit as an error", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        reply(403, { detail: "You do not have permission to perform this action." });
        await expect(PricingService.updateSettings("tok", { num_per_ship: 2 })).rejects.toBeTruthy();
    });
});
