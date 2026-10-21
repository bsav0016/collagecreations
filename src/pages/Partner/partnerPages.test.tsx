import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PartnerAuthProvider } from "../../context/partnerAuthContext";
import PartnerLogin from "./partnerLogin";
import PartnerDashboard from "./partnerDashboard";
import PartnerService from "../../services/PartnerService";

vi.mock("../../services/PartnerService", () => ({
    default: { requestCode: vi.fn(), verifyCode: vi.fn(), getProfile: vi.fn(), getSummary: vi.fn(), getCommissions: vi.fn() },
}));

const svc = vi.mocked(PartnerService);

const open = (path: string) => render(
    <MemoryRouter initialEntries={[path]}>
        <PartnerAuthProvider>
            <Routes>
                <Route path="/partner" element={<PartnerDashboard />} />
                <Route path="/partner/login" element={<PartnerLogin />} />
            </Routes>
        </PartnerAuthProvider>
    </MemoryRouter>,
);

const total = (amount: string, orders: number) => ({ amount, orders });

beforeEach(() => {
    vi.clearAllMocks();
    svc.getProfile.mockResolvedValue({ email: "o@petal.com", partner: "Petal", discount_code: "PETAL10", commission_rate: "0.1000", hold_days: 30 });
    svc.getSummary.mockResolvedValue({ hold_days: 30, by_status: {
        pending: total("8.67", 1), payable: total("0.00", 0), paid: total("20.00", 2), void: total("0.00", 0),
    } });
    svc.getCommissions.mockResolvedValue({ count: 1, next: null, previous: null, results: [
        { id: 5, order_date: "2026-10-01", net_sales: "90.00", amount: "8.67", status: "pending", payable_on: "2026-10-31", paid_at: null },
    ] });
});

describe("partner portal", () => {
    it("sends a signed-out visitor to the login page", async () => {
        open("/partner");
        expect(await screen.findByText("Partner sign in")).toBeTruthy();
        expect(svc.getSummary).not.toHaveBeenCalled();
    });

    it("signs in with an emailed code and shows the partner's totals and orders", async () => {
        svc.requestCode.mockResolvedValue({ message: "ok" });
        svc.verifyCode.mockResolvedValue({ token: "tok", email: "o@petal.com", partner: "Petal" });
        open("/partner/login");
        fireEvent.change(screen.getByLabelText("Email address"), { target: { value: " o@petal.com " } });
        fireEvent.click(screen.getByText("Email me a code"));
        await waitFor(() => expect(svc.requestCode).toHaveBeenCalledWith("o@petal.com"));
        fireEvent.change(await screen.findByLabelText("Code"), { target: { value: "123456" } });
        fireEvent.click(screen.getByText("Sign in"));
        await waitFor(() => expect(svc.verifyCode).toHaveBeenCalledWith("o@petal.com", "123456"));
        expect(await screen.findByText("PETAL10")).toBeTruthy();
        expect(svc.getCommissions).toHaveBeenCalledWith("tok", 1);
        expect(screen.getByText("$8.67", { selector: "div" })).toBeTruthy();
        expect(screen.getByText("$20.00")).toBeTruthy();
        expect(screen.getByText("Payable Oct 31, 2026")).toBeTruthy();
        expect(screen.queryByText(/@customer|address/i)).toBeNull();
    });

    it("shows the server's message for a wrong code and stays on the login page", async () => {
        svc.requestCode.mockResolvedValue({ message: "ok" });
        svc.verifyCode.mockRejectedValue(new Error("That code is invalid or has expired."));
        open("/partner/login");
        fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "o@petal.com" } });
        fireEvent.click(screen.getByText("Email me a code"));
        fireEvent.change(await screen.findByLabelText("Code"), { target: { value: "000000" } });
        fireEvent.click(screen.getByText("Sign in"));
        expect(await screen.findByText("That code is invalid or has expired.")).toBeTruthy();
        expect(screen.getByText("Partner sign in")).toBeTruthy();
    });

    it("keeps the sign-in button disabled until a full 6-digit code is typed", async () => {
        svc.requestCode.mockResolvedValue({ message: "ok" });
        open("/partner/login");
        fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "o@petal.com" } });
        fireEvent.click(screen.getByText("Email me a code"));
        fireEvent.change(await screen.findByLabelText("Code"), { target: { value: "123" } });
        expect(screen.getByText("Sign in").closest("button")!.disabled).toBe(true);
    });
});
