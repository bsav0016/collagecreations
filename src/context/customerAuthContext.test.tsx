import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CustomerAuthProvider, useCustomerAuth } from "./customerAuthContext";

const wrapper = ({ children }: { children: ReactNode }) => <CustomerAuthProvider>{children}</CustomerAuthProvider>;
const session = { token: "tok", email: "ada@example.com", name: "Ada" };

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("customer sign-in state", () => {
    it("starts signed out", () => {
        const { result } = renderHook(() => useCustomerAuth(), { wrapper });

        expect(result.current.customerToken).toBeNull();
        expect(result.current.customerEmail).toBeNull();
    });

    it("signing in exposes the token and email and remembers them for the next visit", () => {
        const first = renderHook(() => useCustomerAuth(), { wrapper });
        act(() => first.result.current.signIn(session));
        expect(first.result.current).toMatchObject({ customerToken: "tok", customerEmail: "ada@example.com" });
        first.unmount();

        const nextVisit = renderHook(() => useCustomerAuth(), { wrapper });

        expect(nextVisit.result.current.customerToken).toBe("tok");
    });

    it("signing out clears the state and the remembered session", () => {
        const { result } = renderHook(() => useCustomerAuth(), { wrapper });
        act(() => result.current.signIn(session));

        act(() => result.current.signOut());

        expect(result.current.customerToken).toBeNull();
        expect(localStorage.getItem("customerSession")).toBeNull();
    });

    it("treats a corrupt saved session as signed out", () => {
        localStorage.setItem("customerSession", "{not json");

        const { result } = renderHook(() => useCustomerAuth(), { wrapper });

        expect(result.current.customerToken).toBeNull();
    });

    it("still signs in for this visit when browser storage is blocked", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("QuotaExceededError");
        });
        const { result } = renderHook(() => useCustomerAuth(), { wrapper });

        act(() => result.current.signIn(session));

        expect(result.current.customerToken).toBe("tok");
    });
});
