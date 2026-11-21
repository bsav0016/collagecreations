import { beforeEach, describe, expect, it, vi } from "vitest";

const loadStripe = vi.hoisted(() => vi.fn(() => Promise.resolve({ fake: "stripe" })));
vi.mock("@stripe/stripe-js", () => ({ loadStripe }));

// The helper keeps its instance in module state, so each test imports a fresh copy.
async function freshModule() {
    vi.resetModules();
    return import("./stripe");
}

describe("getStripe", () => {
    beforeEach(() => {
        loadStripe.mockClear();
        vi.stubEnv("VITE_STRIPE_KEY", "pk_test_abc123");
    });

    it("does not load Stripe.js until a page asks for it", async () => {
        await freshModule();
        expect(loadStripe).not.toHaveBeenCalled();
    });

    it("loads Stripe once with the publishable key, however many times it is asked", async () => {
        const { getStripe } = await freshModule();
        const first = getStripe();
        const second = getStripe();
        const third = getStripe();
        expect(loadStripe).toHaveBeenCalledTimes(1);
        expect(loadStripe).toHaveBeenCalledWith("pk_test_abc123");
        expect(second).toBe(first);
        expect(third).toBe(first);
        await expect(first).resolves.toEqual({ fake: "stripe" });
    });
});
