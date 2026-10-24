import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RefundPanel, { parseDollarsToCents } from "./refundPanel";
import OrderService from "../../services/OrderService";

vi.mock("../../services/OrderService", () => ({ default: { refundOrder: vi.fn() } }));

const mocked = vi.mocked(OrderService);
const onRefunded = vi.fn();

const open = (props: Partial<React.ComponentProps<typeof RefundPanel>> = {}) =>
    render(<RefundPanel token="tok" orderId="7" refundedCents={0} disputed={false} canRefund onRefunded={onRefunded} {...props} />);

beforeEach(() => vi.clearAllMocks());

describe("parseDollarsToCents", () => {
    it("reads dollars and cents, blank as everything left, and rejects the rest", () => {
        expect(parseDollarsToCents("12.50")).toBe(1250);
        expect(parseDollarsToCents("3")).toBe(300);
        expect(parseDollarsToCents("0.07")).toBe(7);
        expect(parseDollarsToCents("  ")).toBeNull();
        for (const bad of ["0", "0.00", "-5", "1.234", "ten", "$5", "1,000"]) expect(parseDollarsToCents(bad)).toBe("invalid");
    });
});

describe("RefundPanel", () => {
    it("asks for confirmation before refunding and sends the amount in cents", async () => {
        mocked.refundOrder.mockResolvedValue(1250);
        open();
        fireEvent.change(screen.getByLabelText(/Amount to refund/), { target: { value: "12.50" } });
        fireEvent.click(screen.getByText("Refund"));
        expect(mocked.refundOrder).not.toHaveBeenCalled();
        expect(screen.getByText(/Refund \$12.50 to the customer's card\?/)).toBeTruthy();
        fireEvent.click(screen.getByText("Yes, refund"));
        await waitFor(() => expect(mocked.refundOrder).toHaveBeenCalledWith("tok", "7", 1250));
        await waitFor(() => expect(onRefunded).toHaveBeenCalledWith(1250));
    });

    it("refunds everything left when the amount is blank", async () => {
        mocked.refundOrder.mockResolvedValue(10000);
        open({ refundedCents: 0 });
        fireEvent.click(screen.getByText("Refund"));
        expect(screen.getByText(/Refund everything that is left/)).toBeTruthy();
        fireEvent.click(screen.getByText("Yes, refund"));
        await waitFor(() => expect(mocked.refundOrder).toHaveBeenCalledWith("tok", "7", undefined));
    });

    it("cancel sends nothing, and a malformed amount cannot be submitted", () => {
        open();
        fireEvent.click(screen.getByText("Refund"));
        fireEvent.click(screen.getByText("Cancel"));
        expect(mocked.refundOrder).not.toHaveBeenCalled();
        fireEvent.change(screen.getByLabelText(/Amount to refund/), { target: { value: "1.234" } });
        expect(screen.getByText("Refund").closest("button")!.disabled).toBe(true);
    });

    it("keeps the old total when the refund fails", async () => {
        mocked.refundOrder.mockRejectedValue("Only 500 cents can still be refunded.");
        open({ refundedCents: 9500 });
        fireEvent.click(screen.getByText("Refund"));
        fireEvent.click(screen.getByText("Yes, refund"));
        await waitFor(() => expect(mocked.refundOrder).toHaveBeenCalled());
        expect(onRefunded).not.toHaveBeenCalled();
        expect(screen.getByText("Refunded so far: $95.00")).toBeTruthy();
    });

    it("shows a dispute warning and hides the button for non-superusers", () => {
        open({ canRefund: false, disputed: true, refundedCents: 250 });
        expect(screen.getByText(/payment dispute/)).toBeTruthy();
        expect(screen.getByText("Refunded so far: $2.50")).toBeTruthy();
        expect(screen.queryByText("Refund")).toBeNull();
    });
});
