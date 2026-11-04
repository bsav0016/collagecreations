import { describe, expect, it } from "vitest";
import { cleanTrackingNumber, trackingUrl } from "./tracking";

describe("tracking numbers", () => {
    it("removes spaces and dashes", () => {
        expect(cleanTrackingNumber("9400 1118 9922 3456 7890 12")).toBe("9400111899223456789012");
        expect(cleanTrackingNumber("9400-1118-9922")).toBe("940011189922");
    });

    it("accepts international numbers and rejects junk", () => {
        expect(cleanTrackingNumber("EA123456789US")).toBe("EA123456789US");
        for (const bad of ["", null, undefined, "123", "ask <b>me</b>", "a".repeat(41)]) expect(cleanTrackingNumber(bad)).toBeNull();
    });

    it("links to the USPS page for that number, or nothing", () => {
        expect(trackingUrl("9400 1118 9922")).toBe("https://tools.usps.com/go/TrackConfirmAction?tLabels=940011189922");
        expect(trackingUrl("soon")).toBeNull();
    });
});
