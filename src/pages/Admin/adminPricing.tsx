import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../layout/navBars/adminNavBar";
import HeaderSection from "../../components/headerSection";
import GeneralButton from "../../components/generalButton/generalButton";
import LoadingScreen from "../../components/loadingScreen/loadingScreen";
import { Input } from "../../components/ui/input";
import { toastRef } from "../../context/toastContext/toastContext";
import { useAuth } from "../../context/authContext";
import PricingService, { CatalogItem, PriceChange, Pricing, ShippingPackage } from "../../services/PricingService";
import { MAX_COST_CENTS, MAX_PRICE_CENTS, centsToDollars, dollarsToCents, rateToPercent } from "../../utils/money";

// Prices and costs are stored in cents; the fields below show and edit dollars.
interface MoneyFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    max: number;
}

function MoneyField({ label, value, onChange, disabled, max }: MoneyFieldProps) {
    const cents = dollarsToCents(value);
    const invalid = cents === null || cents > max;
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <Input
                inputMode="decimal"
                aria-label={label}
                value={value}
                disabled={disabled}
                aria-invalid={invalid}
                className={invalid ? "border-destructive" : ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

// History stores raw values; amounts in cents are shown as dollars.
const showValue = (field: string, value: string): string =>
    field.endsWith("_cents") && /^\d+$/.test(value) ? `$${centsToDollars(Number(value))}` : value;

function NumberField({ label, value, onChange, disabled, valid }: {
    label: string; value: string; onChange: (value: string) => void; disabled: boolean; valid: boolean;
}) {
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <Input inputMode="numeric" aria-label={label} value={value} disabled={disabled} aria-invalid={!valid}
                className={valid ? "" : "border-destructive"} onChange={(e) => onChange(e.target.value)} />
        </label>
    );
}

const notify = (message: string) => toastRef.current?.(message);

function CatalogRow({ item, editable, token, onSaved }: { item: CatalogItem; editable: boolean; token: string; onSaved: () => void }) {
    const [price, setPrice] = useState(centsToDollars(item.price_cents));
    const [cost, setCost] = useState(centsToDollars(item.print_material_cost_cents));
    const [active, setActive] = useState(item.active);
    const priceCents = dollarsToCents(price);
    const costCents = dollarsToCents(cost);
    const valid = priceCents !== null && costCents !== null && priceCents <= MAX_PRICE_CENTS && costCents <= MAX_COST_CENTS;

    const save = async () => {
        if (!valid) return;
        try {
            const result = await PricingService.updateCatalogItem(token, item.id, {
                price_cents: priceCents, print_material_cost_cents: costCents, active,
            });
            notify(result.warnings?.length ? `Saved. Warning: ${result.warnings.join("; ")}` : "Saved");
            onSaved();
        } catch {
            notify("Could not save. Prices are at most $200.00 and costs at most $60.00.");
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end border-b border-border pb-3">
            <div className="font-semibold capitalize">{item.size} {item.kind}</div>
            <MoneyField label={`${item.size} ${item.kind} price`} value={price} onChange={setPrice} disabled={!editable} max={MAX_PRICE_CENTS} />
            <MoneyField label={`${item.size} ${item.kind} print cost`} value={cost} onChange={setCost} disabled={!editable} max={MAX_COST_CENTS} />
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={active} disabled={!editable} onChange={(e) => setActive(e.target.checked)}
                    aria-label={`${item.size} ${item.kind} on sale`} />
                On sale
            </label>
            {editable && <GeneralButton text="Save" onClick={save} disabled={!valid} size="sm" />}
        </div>
    );
}

const inRange = (text: string, max: number) => /^\d+$/.test(text.trim()) && Number(text) >= 1 && Number(text) <= max;

function PackageForm({ pkg, editable, token, onSaved }: { pkg: ShippingPackage; editable: boolean; token: string; onSaved: () => void }) {
    const [charge, setCharge] = useState(centsToDollars(pkg.customer_charge_cents));
    const [cost, setCost] = useState(centsToDollars(pkg.material_cost_cents));
    const [length, setLength] = useState(String(pkg.length));
    const [width, setWidth] = useState(String(pkg.width));
    const [height, setHeight] = useState(String(pkg.height));
    const [weight, setWeight] = useState(String(pkg.weight));
    const chargeCents = dollarsToCents(charge);
    const costCents = dollarsToCents(cost);
    const valid = chargeCents !== null && costCents !== null && chargeCents <= MAX_COST_CENTS && costCents <= MAX_COST_CENTS
        && inRange(length, 108) && inRange(width, 108) && inRange(height, 108) && inRange(weight, 70);

    const save = async () => {
        if (!valid || chargeCents === null || costCents === null) return;
        try {
            await PricingService.updatePackage(token, pkg.id, {
                customer_charge_cents: chargeCents, material_cost_cents: costCents,
                length: Number(length), width: Number(width), height: Number(height), weight: Number(weight),
            });
            notify("Saved");
            onSaved();
        } catch {
            notify("Could not save the shipping package.");
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <MoneyField label="Shipping charge to customer" value={charge} onChange={setCharge} disabled={!editable} max={MAX_COST_CENTS} />
            <MoneyField label="Shipping material cost" value={cost} onChange={setCost} disabled={!editable} max={MAX_COST_CENTS} />
            <NumberField label="Package length (in)" value={length} onChange={setLength} disabled={!editable} valid={inRange(length, 108)} />
            <NumberField label="Package width (in)" value={width} onChange={setWidth} disabled={!editable} valid={inRange(width, 108)} />
            <NumberField label="Package height (in)" value={height} onChange={setHeight} disabled={!editable} valid={inRange(height, 108)} />
            <NumberField label="Package weight (lb)" value={weight} onChange={setWeight} disabled={!editable} valid={inRange(weight, 70)} />
            {editable && <GeneralButton text="Save" onClick={save} disabled={!valid} size="sm" />}
        </div>
    );
}

function SettingsForm({ pricing, token, onSaved }: { pricing: Pricing; token: string; onSaved: () => void }) {
    const s = pricing.settings;
    const editable = pricing.can_edit;
    const [price, setPrice] = useState(centsToDollars(s.download_price_cents));
    const [cost, setCost] = useState(centsToDollars(s.download_cost_cents));
    const [tax, setTax] = useState(rateToPercent(s.tax_rate));
    const [perShip, setPerShip] = useState(String(s.num_per_ship));
    const priceCents = dollarsToCents(price);
    const costCents = dollarsToCents(cost);
    const taxPercent = parseFloat(tax);
    const perShipNumber = Number(perShip);
    const valid = priceCents !== null && costCents !== null && priceCents <= MAX_PRICE_CENTS && costCents <= MAX_COST_CENTS
        && taxPercent >= 0 && taxPercent <= 20 && Number.isInteger(perShipNumber) && perShipNumber >= 1 && perShipNumber <= 30;

    const save = async () => {
        if (!valid || priceCents === null || costCents === null) return;
        try {
            await PricingService.updateSettings(token, {
                download_price_cents: priceCents, download_cost_cents: costCents,
                tax_rate: (taxPercent / 100).toFixed(5), num_per_ship: perShipNumber,
            });
            notify("Saved");
            onSaved();
        } catch {
            notify("Could not save the shop settings.");
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <MoneyField label="Download price" value={price} onChange={setPrice} disabled={!editable} max={MAX_PRICE_CENTS} />
            <MoneyField label="Download cost" value={cost} onChange={setCost} disabled={!editable} max={MAX_COST_CENTS} />
            <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Sales tax rate (%)</span>
                <Input aria-label="Sales tax rate (%)" inputMode="decimal" value={tax} disabled={!editable} onChange={(e) => setTax(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Prints per shipment</span>
                <Input aria-label="Prints per shipment" inputMode="numeric" value={perShip} disabled={!editable} onChange={(e) => setPerShip(e.target.value)} />
            </label>
            {editable && <GeneralButton text="Save" onClick={save} disabled={!valid} size="sm" />}
        </div>
    );
}

function AdminPricing(): React.ReactElement {
    const [pricing, setPricing] = useState<Pricing | null>(null);
    const [history, setHistory] = useState<PriceChange[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userToken } = useAuth();

    const load = useCallback(async () => {
        if (!userToken) {
            navigate("/admin/login");
            return;
        }
        try {
            const [p, h] = await Promise.all([PricingService.getPricing(userToken), PricingService.getHistory(userToken)]);
            setPricing(p);
            setHistory(h);
        } catch {
            notify("Network request error");
        } finally {
            setLoading(false);
        }
    }, [userToken, navigate]);

    useEffect(() => {
        load();
    }, [load]);

    if (loading || !pricing || !userToken) return <LoadingScreen />;
    const editable = pricing.can_edit;

    return (
        <div>
            <AdminNavBar />
            <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-6">
                <HeaderSection title="Pricing" fontSize="2xl" />
                <p className="text-sm text-muted-foreground">
                    {editable
                        ? "Changes apply to new orders only. Prices are at most $200.00; costs and shipping charges at most $60.00."
                        : "View only. A superuser can change prices and costs."}
                </p>

                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">Prints</h2>
                    {pricing.catalog.map((item) => (
                        <CatalogRow key={`${item.id}-${item.price_cents}-${item.print_material_cost_cents}-${item.active}`}
                            item={item} editable={editable} token={userToken} onSaved={load} />
                    ))}
                </section>

                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">Downloads, tax and shipments</h2>
                    <SettingsForm key={JSON.stringify(pricing.settings)} pricing={pricing} token={userToken} onSaved={load} />
                </section>

                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">Shipping package</h2>
                    <p className="text-sm text-muted-foreground">One package is used for every print size. The charge is added once per order to the postage quote.</p>
                    {pricing.packages.slice(0, 1).map((pkg) => (
                        <PackageForm key={`${pkg.id}-${pkg.customer_charge_cents}-${pkg.material_cost_cents}-${pkg.length}-${pkg.width}-${pkg.height}-${pkg.weight}`}
                            pkg={pkg} editable={editable} token={userToken} onSaved={load} />
                    ))}
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Recent changes</h2>
                    {history.length === 0 && <p className="text-sm text-muted-foreground">No changes yet.</p>}
                    {history.map((h) => (
                        <div key={h.id} className="text-sm border-b border-border pb-1">
                            {new Date(h.when).toLocaleString()} - {h.user ?? "unknown"}: {h.item} {h.field.replace(/_/g, " ")}{" "}
                            {showValue(h.field, h.old)} to {showValue(h.field, h.new)}
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default AdminPricing;
