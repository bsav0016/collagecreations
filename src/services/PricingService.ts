import type { Schema } from "../api/types";
import NetworkRequest from "../lib/networkClient";
import { APPLICATION_JSON_HEADER, AUTHORIZATION_HEADER, GET, PUT } from "../lib/networkRequestConstants";

// Shapes come from the backend's schema (see src/api/types.ts), so a renamed field fails the build.
export type CatalogItem = Schema<"PricingCatalogItem">;
export type ShopSettings = Schema<"PricingSettings">;
export type ShippingPackage = Schema<"PricingPackage">;
export type Pricing = Schema<"PricingSnapshot">;
export type PriceChange = Schema<"PriceChangeRow">;

const headers = (token: string) => ({ ...APPLICATION_JSON_HEADER, ...AUTHORIZATION_HEADER(token) });

const put = async <T>(path: string, token: string, body: object): Promise<T> =>
    (await NetworkRequest<T>({ urlExtension: `api/admin/pricing/${path}`, method: PUT, headers: headers(token), body: JSON.stringify(body) })).data;

const PricingService = {
    getPricing: async (token: string): Promise<Pricing> =>
        (await NetworkRequest<Pricing>({ urlExtension: "api/admin/pricing/", method: GET, headers: headers(token) })).data,

    getHistory: async (token: string): Promise<PriceChange[]> =>
        (await NetworkRequest<Schema<"PriceHistory">>({
            urlExtension: "api/admin/pricing/history/", method: GET, headers: headers(token),
        })).data.history,

    updateCatalogItem: (token: string, id: number, body: Schema<"CatalogItemUpdate">) =>
        put<Schema<"CatalogItemUpdated">>(`catalog/${id}/`, token, body),

    updateSettings: (token: string, body: Schema<"ShopSettingsUpdate">) =>
        put<Schema<"ShopSettingsUpdated">>("settings/", token, body),

    updatePackage: (token: string, id: number, body: Schema<"ShippingPackageUpdate">) =>
        put<Schema<"PackageUpdated">>(`packages/${id}/`, token, body),
};

export default PricingService;
