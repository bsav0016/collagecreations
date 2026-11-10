import NetworkRequest from "../lib/networkClient";
import type { Schema } from "../api/types";
import { APPLICATION_JSON_HEADER, GET, POST } from "../lib/networkRequestConstants";

// Shapes come from the backend's schema (see src/api/types.ts).
export type PartnerSession = Schema<"PartnerSession">;

export type PartnerProfile = Schema<"PartnerMe">;

export type CommissionStatus = "pending" | "payable" | "paid" | "void";

export type StatusTotal = Schema<"PartnerStatusTotal">;

export type PartnerSummary = Schema<"PartnerSummary">;

// The schema types status as a plain string; the screens rely on the four known values.
export type PartnerCommission = Omit<Schema<"PartnerCommission">, "status"> & { status: CommissionStatus };

export type PayoutState = Schema<"PartnerPayoutState">;

export type CommissionPage = Omit<Schema<"PartnerCommissionPage">, "results"> & { results: PartnerCommission[] };

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
        call<Schema<"PartnerCodeRequested">>("email/request/", POST, "We couldn't send the code. Please try again.", undefined, { email } satisfies Schema<"PartnerCodeRequest">),

    verifyCode: (email: string, code: string) =>
        call<PartnerSession>("email/verify/", POST, "That code is invalid or has expired.", undefined, { email, code } satisfies Schema<"PartnerCodeVerify">),

    getProfile: (token: string) => call<PartnerProfile>("me/", GET, "Could not load your account.", token),

    getSummary: (token: string) => call<PartnerSummary>("summary/", GET, "Could not load your totals.", token),

    getPayouts: (token: string) => call<PayoutState>("payouts/", GET, "Could not load your payout status.", token),

    startPayoutSetup: (token: string) =>
        call<Schema<"OnboardingLink">>("payouts/onboard/", POST, "We couldn't open payout setup. Please try again later.", token),

    getCommissions: (token: string, page = 1) =>
        call<CommissionPage>(`commissions/?page=${page}`, GET, "Could not load your commissions.", token),
};

export default PartnerService;
