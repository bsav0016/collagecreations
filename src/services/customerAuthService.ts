import NetworkRequest from "../lib/networkClient";
import type { Schema } from "../api/types";
import {
    APPLICATION_JSON_HEADER,
    CUSTOMER_AUTHORIZATION_HEADER,
    DELETE,
    GET,
    POST,
} from "../lib/networkRequestConstants";

// Shapes come from the backend's schema (see src/api/types.ts).
export type CustomerSession = Schema<"CustomerSession">;

export type ClaimedCollage = Schema<"CartImage">;

const postJson = <T,>(urlExtension: string, body: object, token?: string) =>
    NetworkRequest<T>({
        urlExtension,
        method: POST,
        headers: {
            ...APPLICATION_JSON_HEADER,
            ...(token ? CUSTOMER_AUTHORIZATION_HEADER(token) : {}),
        },
        body: JSON.stringify(body),
    });

export async function signInWithGoogle(credential: string): Promise<CustomerSession> {
    return (await postJson<CustomerSession>("api/customer/google/", { credential } satisfies Schema<"GoogleLoginRequest">)).data;
}

export async function signInWithMicrosoft(credential: string): Promise<CustomerSession> {
    return (await postJson<CustomerSession>("api/customer/microsoft/", { credential } satisfies Schema<"MicrosoftLoginRequest">)).data;
}

export async function requestEmailCode(email: string): Promise<void> {
    await postJson("api/customer/email/request/", { email } satisfies Schema<"EmailCodeRequest">);
}

export async function verifyEmailCode(email: string, code: string): Promise<CustomerSession> {
    return (await postJson<CustomerSession>("api/customer/email/verify/", { email, code } satisfies Schema<"EmailCodeVerify">)).data;
}

// Attaches the collage to the signed-in customer (so it is kept longer) and returns the real
// preview. Safe to call again for a collage they already own.
export async function claimCollage(token: string, temporaryImageId: string): Promise<ClaimedCollage> {
    return (await postJson<ClaimedCollage>(
        "api/claim-collage/",
        { temporary_image_id: temporaryImageId } satisfies Schema<"ClaimCollageRequest">,
        token,
    )).data;
}

export type CustomerOrder = Schema<"CustomerOrder">;

export async function getMyOrders(token: string): Promise<CustomerOrder[]> {
    const response = await NetworkRequest<Schema<"CustomerOrders">>({
        urlExtension: "api/customer/orders/",
        method: GET,
        headers: CUSTOMER_AUTHORIZATION_HEADER(token),
    });
    return response.data.orders;
}

// Starts a new saved collage from a past order and returns it ready for the preview page.
export async function reorderOrder(token: string, orderId: number): Promise<ClaimedCollage> {
    return (await postJson<ClaimedCollage>(`api/customer/orders/${orderId}/reorder/`, {}, token)).data;
}

export type SavedCollage = Schema<"SavedCollage">;

export async function getSavedCollages(token: string): Promise<SavedCollage[]> {
    const response = await NetworkRequest<Schema<"SavedCollages">>({
        urlExtension: "api/customer/collages/",
        method: GET,
        headers: CUSTOMER_AUTHORIZATION_HEADER(token),
    });
    return response.data.collages;
}

export async function deleteSavedCollage(token: string, collageId: string): Promise<void> {
    await NetworkRequest({
        urlExtension: `api/customer/collages/${collageId}/`,
        method: DELETE,
        headers: CUSTOMER_AUTHORIZATION_HEADER(token),
    });
}

export async function exportMyData(token: string): Promise<Schema<"CustomerExport">> {
    return (await NetworkRequest<Schema<"CustomerExport">>({
        urlExtension: "api/customer/export/",
        method: GET,
        headers: CUSTOMER_AUTHORIZATION_HEADER(token),
    })).data;
}

export async function deleteMyAccount(token: string, confirmEmail: string): Promise<void> {
    await postJson("api/customer/delete-account/", { confirm_email: confirmEmail } satisfies Schema<"DeleteAccountRequest">, token);
}
