import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResendShipmentEmail from "./resendShipmentEmail";
import OrderService from "../../services/OrderService";

vi.mock("../../services/OrderService", () => ({ default: { resendShipmentEmail: vi.fn() } }));

const mocked = vi.mocked(OrderService);

beforeEach(() => vi.clearAllMocks());

describe("ResendShipmentEmail", () => {
    it("asks the server to send the email again for this order", async () => {
        mocked.resendShipmentEmail.mockResolvedValue(undefined);
        render(<ResendShipmentEmail token="tok" orderId="7" />);
        fireEvent.click(screen.getByText("Resend shipping email"));
        await waitFor(() => expect(mocked.resendShipmentEmail).toHaveBeenCalledWith("tok", "7"));
        await waitFor(() => expect(screen.getByText("Resend shipping email")).toBeTruthy());
    });

    it("recovers when the send fails", async () => {
        mocked.resendShipmentEmail.mockRejectedValue(new Error("down"));
        render(<ResendShipmentEmail token="tok" orderId="7" />);
        fireEvent.click(screen.getByText("Resend shipping email"));
        await waitFor(() => expect(screen.getByText("Resend shipping email").closest("button")!.disabled).toBe(false));
    });
});
