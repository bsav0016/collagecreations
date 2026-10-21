import { describe, expect, it } from "vitest";
import { centsToDollars, dollarsToCents, MAX_COST_CENTS } from "./money";

describe("money", () => {
    it("shows cents as dollars", () => {
        expect(centsToDollars(8000)).toBe("80.00");
        expect(centsToDollars(5)).toBe("0.05");
    });

    it("reads dollars as whole cents without float drift", () => {
        expect(dollarsToCents("18.50")).toBe(1850);
        expect(dollarsToCents("$0.10")).toBe(10);
        expect(dollarsToCents("1.15")).toBe(115);
        expect(dollarsToCents(" 60 ")).toBe(MAX_COST_CENTS);
    });

    it.each(["", "abc", "-1", "1.234", "1,50", "1e3"])("rejects %j", (text) => {
        expect(dollarsToCents(text)).toBeNull();
    });
});
