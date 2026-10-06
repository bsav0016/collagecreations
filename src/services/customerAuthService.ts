import NetworkRequest from "../lib/networkClient";
import {
    APPLICATION_JSON_HEADER,
    CUSTOMER_AUTHORIZATION_HEADER,
    GET,
    POST,
} from "../lib/networkRequestConstants";

export interface CustomerSession {
    token: string;
    email: string;
    name: string;
}

export interface ClaimedCollage {
    temporary_image_id: string;
    base_cost: number;
    watermark_collage: string | null;
    expires_at: string;
}

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
    return (await postJson<CustomerSession>("api/customer/google/", { credential })).data;
}

export async function signInWithMicrosoft(credential: string): Promise<CustomerSession> {
    return (await postJson<CustomerSession>("api/customer/microsoft/", { credential })).data;
}

export async function requestEmailCode(email: string): Promise<void> {
    await postJson("api/customer/email/request/", { email });
}

export async function verifyEmailCode(email: string, code: string): Promise<CustomerSession> {
    return (await postJson<CustomerSession>("api/customer/email/verify/", { email, code })).data;
}

// Attaches the collage to the signed-in customer (so it is kept longer) and returns the real
// preview. Safe to call again for a collage they already own.
export async function claimCollage(token: string, temporaryImageId: string): Promise<ClaimedCollage> {
    return (await postJson<ClaimedCollage>(
        "api/claim-collage/",
        { temporary_image_id: temporaryImageId },
        token,
    )).data;
}

export interface CustomerOrder {
    id: number;
    order_date: string;
    order_type: string;
    quantity: number;
    printed: boolean;
    shipped: boolean;
    delivered: boolean;
    shipping_number: string;
    download_token: string | null;
    can_reorder: boolean;
}

export async function getMyOrders(token: string): Promise<CustomerOrder[]> {
    const response = await NetworkRequest<{ orders: CustomerOrder[] }>({
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
