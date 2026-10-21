import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import GeneralButton from "../../components/generalButton/generalButton";
import HeaderSection from "../../components/headerSection";
import LoadingScreen from "../../components/loadingScreen/loadingScreen";
import { usePartnerAuth } from "../../context/partnerAuthContext";
import PartnerService, {
    CommissionPage, CommissionStatus, PartnerProfile, PartnerSummary,
} from "../../services/PartnerService";

const PAGE_SIZE = 50;

const STATUS_LABEL: Record<CommissionStatus, string> = {
    pending: "Pending", payable: "Ready to pay", paid: "Paid", void: "Cancelled",
};

const money = (amount: string) => `$${Number(amount).toFixed(2)}`;

// Dates arrive as YYYY-MM-DD; show them as written rather than shifting them through the viewer's timezone.
const day = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

function PartnerDashboard(): React.ReactElement {
    const { session, signOut } = usePartnerAuth();
    const token = session?.token ?? "";
    const [profile, setProfile] = useState<PartnerProfile | null>(null);
    const [summary, setSummary] = useState<PartnerSummary | null>(null);
    const [commissions, setCommissions] = useState<CommissionPage | null>(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            const [p, s, c] = await Promise.all([
                PartnerService.getProfile(token), PartnerService.getSummary(token), PartnerService.getCommissions(token, page),
            ]);
            setProfile(p);
            setSummary(s);
            setCommissions(c);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load your account.");
        }
    }, [token, page]);

    useEffect(() => {
        if (token) load();
    }, [token, load]);

    if (!session) return <Navigate to="/partner/login" replace />;
    if (error) {
        return (
            <div className="mx-auto max-w-md px-4 py-10 flex flex-col gap-4 text-center">
                <p className="text-red-500">{error}</p>
                <GeneralButton text="Sign in again" onClick={signOut} />
            </div>
        );
    }
    if (!profile || !summary || !commissions) return <LoadingScreen />;

    const totals = summary.by_status;
    const pages = Math.max(1, Math.ceil(commissions.count / PAGE_SIZE));
    return (
        <div className="mx-auto max-w-4xl px-4 py-6 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <HeaderSection title={profile.partner} fontSize="2xl" />
                <GeneralButton text="Sign out" variant="ghost" size="sm" onClick={signOut} />
            </div>
            <p className="text-sm text-muted-foreground">
                Your discount code is <strong>{profile.discount_code}</strong>. You earn {Number(profile.commission_rate) * 100}% of
                the profit on each order that uses it. Commissions are paid {summary.hold_days} days after the order, once the
                return window has passed, and are cancelled if the order is refunded.
            </p>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Totals">
                {(["pending", "payable", "paid", "void"] as CommissionStatus[]).map((s) => (
                    <div key={s} className="rounded-lg border p-3">
                        <div className="text-sm text-muted-foreground">{STATUS_LABEL[s]}</div>
                        <div className="text-xl font-semibold">{money(totals[s].amount)}</div>
                        <div className="text-xs text-muted-foreground">{totals[s].orders} order{totals[s].orders === 1 ? "" : "s"}</div>
                    </div>
                ))}
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Orders</h2>
                {commissions.results.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders with your code yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-muted-foreground border-b">
                                    <th className="py-2 pr-3">Order date</th>
                                    <th className="py-2 pr-3">Sale</th>
                                    <th className="py-2 pr-3">Your commission</th>
                                    <th className="py-2 pr-3">Status</th>
                                    <th className="py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.results.map((c) => (
                                    <tr key={c.id} className="border-b">
                                        <td className="py-2 pr-3">{day(c.order_date)}</td>
                                        <td className="py-2 pr-3">{money(c.net_sales)}</td>
                                        <td className="py-2 pr-3">{money(c.amount)}</td>
                                        <td className="py-2 pr-3">{STATUS_LABEL[c.status]}</td>
                                        <td className="py-2">
                                            {c.status === "pending" && c.payable_on ? `Payable ${day(c.payable_on)}` : ""}
                                            {c.status === "paid" && c.paid_at ? `Paid ${day(c.paid_at)}` : ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {pages > 1 && (
                    <div className="flex items-center gap-3">
                        <GeneralButton text="Previous" variant="ghost" size="sm" disabled={!commissions.previous} onClick={() => setPage(page - 1)} />
                        <span className="text-sm">Page {page} of {pages}</span>
                        <GeneralButton text="Next" variant="ghost" size="sm" disabled={!commissions.next} onClick={() => setPage(page + 1)} />
                    </div>
                )}
            </section>
        </div>
    );
}

export default PartnerDashboard;
