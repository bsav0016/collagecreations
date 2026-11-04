import { describe, expect, it } from "vitest";
import { bucketOf } from "./orderBuckets";

const order = (over: Partial<Parameters<typeof bucketOf>[0]> = {}) =>
    ({ orderType: "order", printed: false, shipped: false, delivered: false, ...over });

describe("bucketOf", () => {
    it("groups by the server's status", () => {
        expect(bucketOf(order({ status: "paid" }))).toBe("unactioned");
        expect(bucketOf(order({ printed: true, status: "printed" }))).toBe("printed");
        expect(bucketOf(order({ printed: true, shipped: true, status: "shipped" }))).toBe("shipped");
        expect(bucketOf(order({ printed: true, shipped: true, delivered: true, status: "delivered" }))).toBe("delivered");
    });

    it("puts a problem order in its own list", () => {
        expect(bucketOf(order({ printed: true, shipped: true, status: "problem" }))).toBe("problem");
    });

    it("works out the bucket from the flags when an older server sends no status", () => {
        expect(bucketOf(order())).toBe("unactioned");
        expect(bucketOf(order({ printed: true }))).toBe("printed");
        expect(bucketOf(order({ printed: true, shipped: true }))).toBe("shipped");
        expect(bucketOf(order({ printed: true, shipped: true, delivered: true }))).toBe("delivered");
    });

    it("keeps downloads apart and flags that skip a step invalid", () => {
        expect(bucketOf(order({ orderType: "download", status: "paid" }))).toBe("download");
        expect(bucketOf(order({ shipped: true }))).toBe("invalid");
        expect(bucketOf(order({ printed: true, delivered: true }))).toBe("invalid");
    });

    it("treats an unknown status as invalid rather than guessing", () => {
        expect(bucketOf(order({ status: "lost-in-space" }))).toBe("invalid");
    });
});
