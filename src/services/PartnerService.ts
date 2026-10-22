import NetworkRequest from "../lib/networkClient";
import { APPLICATION_JSON_HEADER, GET, POST } from "../lib/networkRequestConstants";

export interface PartnerSession {
    token: string;
    email: string;
    partner: string;
}

export interface PartnerProfile {
    email: string;
    partner: string;
    discount_code: string;
    commission_rate: string;
    hold_days: number;
}

export type CommissionStatus = "pending" | "payable" | "paid" | "void";

export interface StatusTotal {
    orders: number;
    amount: string;
}

export interface PartnerSummary {
    hold_days: number;
    by_status: Record<CommissionStatus, StatusTotal>;
}

export interface PartnerCommission {
    id: number;
    order_date: string;
    net_sales: string;
    amount: string;
    status: CommissionStatus;
    payable_on: string | null;
    paid_at: string | null;
}

export interface PayoutState {
    enabled: boolean;
    status: "not_started" | "incomplete" | "ready";
    payouts_enabled: boolean;
}

export interface CommissionPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: PartnerCommission[];
}

// The backend answers errors as {"detail": "..."}; hand the screens a plain message.
const message = (error: unknown, fallback: string): string => {
    if (typeof error === "string") return error;
    const detail = (error as { detail?: unknown } | null)?.detail;
    return typeof detail === "string" ? detail : fallback;
};

const call = async <T>(path: string, method: string, fallback: string, token?: string, body?: object): Promise<T> => {
    try {
        return (await NetworkRequest<T>({
            urlExtension: `api/partner/${path}`,
            method,
            headers: { ...APPLICATION_JSON_HEADER, ...(token ? { Authorization: `Partner ${token}` } : {}) },
            body: body ? JSON.stringify(body) : undefined,
        })).data;
    } catch (error) {
        throw new Error(message(error, fallback));
    }
};

const PartnerService = {
    requestCode: (email: string) =>
        call<{ message: string }>("email/request/", POST, "We couldn't send the code. Please try again.", undefined, { email }),

    verifyCode: (email: string, code: string) =>
        call<PartnerSession>("email/verify/", POST, "That code is invalid or has expired.", undefined, { email, code }),

    getProfile: (token: string) => call<PartnerProfile>("me/", GET, "Could not load your account.", token),

    getSummary: (token: string) => call<PartnerSummary>("summary/", GET, "Could not load your totals.", token),

    getPayouts: (token: string) => call<PayoutState>("payouts/", GET, "Could not load your payout status.", token),

    startPayoutSetup: (token: string) =>
        call<{ url: string }>("payouts/onboard/", POST, "We couldn't open payout setup. Please try again later.", token),

    getCommissions: (token: string, page = 1) =>
        call<CommissionPage>(`commissions/?page=${page}`, GET, "Could not load your commissions.", token),
};

export default PartnerService;
