import { describe, expect, it, vi } from "vitest";
import type { PaymentMethod } from "@stripe/stripe-js";
import PaymentService from "./PaymentService";
import NetworkRequest from "../lib/networkClient";

vi.mock("../lib/networkClient");
const network = vi.mocked(NetworkRequest);

const form = {
    firstname: "Ada", lastname: "Lovelace", email: "ada@example.com",
    address1: "1 Main St", city: "Honolulu", state: "HI", zipCode: "96818",
};

const sentBody = () => JSON.parse(network.mock.calls[0][0].body as string);

describe("PaymentService.calculateShipping", () => {
    it("posts the ZIP, quantity and cart id and returns camel-cased amounts", async () => {
        network.mockResolvedValue({ status: 200, data: { base_cost: 3000, shipping_cost: 1150, tax: 207.5 } });

        const result = await PaymentService.calculateShipping(form, "cart-1", 2);

        expect(network.mock.calls[0][0].urlExtension).toBe("api/get-shipping-cost/");
        expect(sentBody()).toMatchObject({ destinationZIPCode: "96818", quantity: 2, tempImageId: "cart-1" });
        expect(sentBody().mailingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(result).toMatchObject({ baseCost: 3000, shippingCost: 1150, tax: 207.5 });
    });

    it("hides the API's error behind a friendly message", async () => {
        network.mockRejectedValue("USPS exploded");

        await expect(PaymentService.calculateShipping(form, "cart-1", 1)).rejects.toThrow("Could not get shipping cost");
    });
});

describe("PaymentService.calculateTax", () => {
    it("posts the cart id and returns the tax", async () => {
        network.mockResolvedValue({ status: 200, data: { tax: 25 } });

        const result = await PaymentService.calculateTax("cart-1");

        expect(network.mock.calls[0][0].urlExtension).toBe("api/get-tax/");
        expect(sentBody()).toEqual({ tempImageId: "cart-1" });
        expect(result.tax).toBe(25);
    });

    it("hides the API's error behind a friendly message", async () => {
        network.mockRejectedValue(new Error("boom"));

        await expect(PaymentService.calculateTax("cart-1")).rejects.toThrow("Could not get tax");
    });
});

describe("PaymentService.createPayment", () => {
    it("sends only the payment method id, never the whole card object", async () => {
        network.mockResolvedValue({ status: 200, data: { token: "t", id: 4 } });
        const method = { id: "pm_123", card: { last4: "4242" } } as unknown as PaymentMethod;

        const result = await PaymentService.createPayment(method, "cart-1", "order", form);

        expect(network.mock.calls[0][0].urlExtension).toBe("api/payment/");
        expect(sentBody()).toMatchObject({
            paymentMethod: "pm_123", paymentIntentId: null, tempImageId: "cart-1", type: "order",
            email: "ada@example.com", zip: "96818",
        });
        expect(JSON.stringify(sentBody())).not.toContain("4242");
        expect(result).toMatchObject({ token: "t", id: 4, requiresAction: false });
    });

    it("finishes a 3-D Secure payment with the intent id and no payment method", async () => {
        network.mockResolvedValue({ status: 200, data: { token: "t", id: 4 } });

        await PaymentService.createPayment(null, "cart-1", "order", form, "pi_9");

        expect(sentBody()).toMatchObject({ paymentMethod: null, paymentIntentId: "pi_9" });
    });

    it("reports when the bank needs extra confirmation", async () => {
        network.mockResolvedValue({ status: 200, data: { requires_action: true, client_secret: "cs_1" } });

        const result = await PaymentService.createPayment(null, "cart-1", "order", form);

        expect(result).toMatchObject({ requiresAction: true, clientSecret: "cs_1" });
    });

    it("fills optional address fields with empty strings for a download order", async () => {
        network.mockResolvedValue({ status: 200, data: { token: "t", id: 4 } });

        await PaymentService.createPayment(null, "cart-1", "download",
            { firstname: "A", lastname: "B", email: "a@b.com", zipCode: "" });

        expect(sentBody()).toMatchObject({ address1: "", address2: "", city: "", state: "", zip: "" });
    });

    it("surfaces a decline's message to the caller", async () => {
        network.mockRejectedValue(new Error("Your card was declined."));

        await expect(PaymentService.createPayment(null, "cart-1", "order", form)).rejects.toThrow("Your card was declined.");
    });
});
