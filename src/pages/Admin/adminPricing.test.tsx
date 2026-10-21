import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPricing from "./adminPricing";
import PricingService, { Pricing } from "../../services/PricingService";
import { toastRef } from "../../context/toastContext/toastContext";

vi.mock("../../context/authContext", () => ({ useAuth: () => ({ userToken: "tok", isSuperuser: true }) }));
vi.mock("../../layout/navBars/adminNavBar", () => ({ default: () => <nav /> }));
vi.mock("../../services/PricingService", async (original) => {
    const real = await original<typeof import("../../services/PricingService")>();
    return { ...real, default: { getPricing: vi.fn(), getHistory: vi.fn(), updateCatalogItem: vi.fn(), updateSettings: vi.fn(), updatePackage: vi.fn(), deletePackage: vi.fn() } };
});

const pricing = (canEdit: boolean): Pricing => ({
    can_edit: canEdit, max_cents: 6000,
    catalog: [{ id: 1, size: "24x36", kind: "collage", price_cents: 8000, print_material_cost_cents: 2000, active: true }],
    settings: { download_price_cents: 500, download_cost_cents: 0, tax_rate: "0.04712", num_per_ship: 3 },
    packages: [{ id: 1, name: "small", max_short_side_inches: 12, weight: 1, length: 16, width: 3, height: 3, customer_charge_cents: 150, material_cost_cents: 80 }],
});

const twoPackages = (): Pricing => ({
    ...pricing(true),
    packages: [
        ...pricing(true).packages,
        { id: 2, name: "large", max_short_side_inches: null, weight: 2, length: 26, width: 4, height: 4, customer_charge_cents: 240, material_cost_cents: 90 },
    ],
});

const mocked = vi.mocked(PricingService);
const open = () => render(<MemoryRouter><AdminPricing /></MemoryRouter>);

beforeEach(() => {
    vi.clearAllMocks();
    mocked.getHistory.mockResolvedValue([{ id: 1, when: "2026-10-21T00:00:00Z", user: "boss", item: "24x36 collage", field: "price_cents", old: "9000", new: "8000" }]);
});

describe("AdminPricing", () => {
    it("shows prices and costs read-only to staff", async () => {
        mocked.getPricing.mockResolvedValue(pricing(false));
        open();
        expect(((await screen.findByDisplayValue("80.00")) as HTMLInputElement).disabled).toBe(true);
        expect((screen.getByDisplayValue("20.00") as HTMLInputElement).disabled).toBe(true);
        expect(screen.queryByText("Save")).toBeNull();
        expect(screen.getByText(/View only/)).toBeTruthy();
    });

    it("lets a superuser save a price in cents", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        mocked.updateCatalogItem.mockResolvedValue({ warnings: [] });
        open();
        const price = await screen.findByLabelText("24x36 collage price");
        fireEvent.change(price, { target: { value: "75.50" } });
        fireEvent.click(screen.getAllByText("Save")[0]);
        await waitFor(() => expect(mocked.updateCatalogItem).toHaveBeenCalledWith("tok", 1, {
            price_cents: 7550, print_material_cost_cents: 2000, active: true,
        }));
    });

    it("blocks amounts over the limits or malformed before calling the server", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        open();
        const price = await screen.findByLabelText("24x36 collage price");
        fireEvent.change(price, { target: { value: "200.01" } });
        expect(screen.getAllByText("Save")[0].closest("button")!.disabled).toBe(true);
        fireEvent.change(price, { target: { value: "200.00" } });
        expect(screen.getAllByText("Save")[0].closest("button")!.disabled).toBe(false);
        fireEvent.change(screen.getByLabelText("24x36 collage print cost"), { target: { value: "60.01" } });
        expect(screen.getAllByText("Save")[0].closest("button")!.disabled).toBe(true);
        fireEvent.change(screen.getByLabelText("24x36 collage print cost"), { target: { value: "20.00" } });
        fireEvent.change(price, { target: { value: "abc" } });
        expect(screen.getAllByText("Save")[0].closest("button")!.disabled).toBe(true);
        expect(mocked.updateCatalogItem).not.toHaveBeenCalled();
    });

    it("shows amounts in the change history as dollars", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        open();
        expect(await screen.findByText(/\$90\.00 to \$80\.00/)).toBeTruthy();
    });

    it("shows the tax rate without floating-point noise", async () => {
        mocked.getPricing.mockResolvedValue({ ...pricing(true), settings: { ...pricing(true).settings, tax_rate: "0.04712" } });
        open();
        expect(await screen.findByDisplayValue("4.712")).toBeTruthy();
    });

    it("calls a lone package the shipping tube and offers no remove button", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        open();
        expect(await screen.findByText("Shipping tube")).toBeTruthy();
        expect(screen.queryByText("Remove")).toBeNull();
        expect(screen.queryByText(/16×3×3/)).toBeNull();
    });

    it("saves a tube's dimensions and weight along with its amounts", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        mocked.updatePackage.mockResolvedValue({});
        open();
        fireEvent.change(await screen.findByLabelText("Shipping tube length (in)"), { target: { value: "30" } });
        fireEvent.click(screen.getAllByText("Save")[screen.getAllByText("Save").length - 1]);
        await waitFor(() => expect(mocked.updatePackage).toHaveBeenCalledWith("tok", 1, {
            customer_charge_cents: 150, material_cost_cents: 80, length: 30, width: 3, height: 3, weight: 1,
        }));
    });

    it("blocks impossible tube dimensions", async () => {
        mocked.getPricing.mockResolvedValue(pricing(true));
        open();
        fireEvent.change(await screen.findByLabelText("Shipping tube weight (lb)"), { target: { value: "0" } });
        const saves = screen.getAllByText("Save");
        expect(saves[saves.length - 1].closest("button")!.disabled).toBe(true);
    });

    it("lets a superuser remove one of two packages after confirming", async () => {
        mocked.getPricing.mockResolvedValue(twoPackages());
        mocked.deletePackage.mockResolvedValue(undefined);
        let confirm: (() => void) | null | undefined;
        toastRef.current = ((_m: string, _t?: string, cb?: (() => void) | null) => { confirm = cb; }) as never;
        open();
        const removes = await screen.findAllByText("Remove");
        expect(removes).toHaveLength(2);
        expect(screen.getByText("small tube")).toBeTruthy();
        fireEvent.click(removes[1]);
        expect(mocked.deletePackage).not.toHaveBeenCalled();  // nothing happens until confirmed
        confirm?.();
        await waitFor(() => expect(mocked.deletePackage).toHaveBeenCalledWith("tok", 2));
    });
});
