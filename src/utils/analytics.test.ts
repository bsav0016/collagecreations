import { describe, expect, it } from "vitest";
import { analyticsScript, installAnalytics } from "./analytics";

describe("analyticsScript", () => {
    it("is off without a provider and site id", () => {
        expect(analyticsScript({})).toBeNull();
        expect(analyticsScript({ provider: "umami" })).toBeNull();
        expect(analyticsScript({ siteId: "abc" })).toBeNull();
        expect(analyticsScript({ provider: "  ", siteId: "abc" })).toBeNull();
    });

    it("rejects an unknown provider", () => {
        expect(analyticsScript({ provider: "somewhere-else", siteId: "abc" })).toBeNull();
    });

    it("builds the Umami script with Do Not Track respected", () => {
        expect(analyticsScript({ provider: "Umami", siteId: " 1234-abcd " })).toEqual({
            src: "https://cloud.umami.is/script.js",
            attributes: { "data-website-id": "1234-abcd", "data-do-not-track": "true" },
        });
    });

    it("builds the Plausible script from the domain", () => {
        expect(analyticsScript({ provider: "plausible", siteId: "collagecreations.org" })).toEqual({
            src: "https://plausible.io/js/script.js",
            attributes: { "data-domain": "collagecreations.org" },
        });
    });

    it("accepts a self-hosted https address but never a plain http or relative one", () => {
        expect(analyticsScript({ provider: "umami", siteId: "x", src: "https://stats.example.com/s.js" })?.src).toBe("https://stats.example.com/s.js");
        expect(analyticsScript({ provider: "umami", siteId: "x", src: "http://stats.example.com/s.js" })).toBeNull();
        expect(analyticsScript({ provider: "umami", siteId: "x", src: "//stats.example.com/s.js" })).toBeNull();
    });
});

describe("installAnalytics", () => {
    it("adds one deferred script and does not add a second", () => {
        document.head.innerHTML = "";
        const config = { provider: "umami", siteId: "1234" };
        expect(installAnalytics(config)).toBe(true);
        expect(installAnalytics(config)).toBe(false);
        const scripts = document.head.querySelectorAll("script[data-analytics]");
        expect(scripts).toHaveLength(1);
        expect(scripts[0].getAttribute("src")).toBe("https://cloud.umami.is/script.js");
        expect(scripts[0].getAttribute("data-website-id")).toBe("1234");
        expect((scripts[0] as HTMLScriptElement).defer).toBe(true);
    });

    it("adds nothing when not configured", () => {
        document.head.innerHTML = "";
        expect(installAnalytics({})).toBe(false);
        expect(document.head.querySelectorAll("script")).toHaveLength(0);
    });
});
