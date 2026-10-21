import NetworkRequest from "../lib/networkClient";
import { APPLICATION_JSON_HEADER, AUTHORIZATION_HEADER, DELETE, GET, PUT } from "../lib/networkRequestConstants";

export interface CatalogItem {
    id: number;
    size: string;
    kind: "collage" | "regular";
    price_cents: number;
    print_material_cost_cents: number;
    active: boolean;
}

export interface ShopSettings {
    download_price_cents: number;
    download_cost_cents: number;
    tax_rate: string;
    num_per_ship: number;
}

export interface ShippingPackage {
    id: number;
    name: string;
    max_short_side_inches: number | null;
    weight: number;
    length: number;
    width: number;
    height: number;
    customer_charge_cents: number;
    material_cost_cents: number;
}

export interface Pricing {
    can_edit: boolean;
    max_cents: number;
    catalog: CatalogItem[];
    settings: ShopSettings;
    packages: ShippingPackage[];
}

export interface PriceChange {
    id: number;
    when: string;
    user: string | null;
    item: string;
    field: string;
    old: string;
    new: string;
}

const headers = (token: string) => ({ ...APPLICATION_JSON_HEADER, ...AUTHORIZATION_HEADER(token) });

const put = async <T>(path: string, token: string, body: object): Promise<T> =>
    (await NetworkRequest<T>({ urlExtension: `api/admin/pricing/${path}`, method: PUT, headers: headers(token), body: JSON.stringify(body) })).data;

const PricingService = {
    getPricing: async (token: string): Promise<Pricing> =>
        (await NetworkRequest<Pricing>({ urlExtension: "api/admin/pricing/", method: GET, headers: headers(token) })).data,

    getHistory: async (token: string): Promise<PriceChange[]> =>
        (await NetworkRequest<{ history: PriceChange[] }>({
            urlExtension: "api/admin/pricing/history/", method: GET, headers: headers(token),
        })).data.history,

    updateCatalogItem: (token: string, id: number, body: Partial<Omit<CatalogItem, "id" | "size" | "kind">>) =>
        put<{ warnings: string[] }>(`catalog/${id}/`, token, body),

    updateSettings: (token: string, body: Partial<ShopSettings>) => put<object>("settings/", token, body),

    updatePackage: (token: string, id: number, body: Partial<Omit<ShippingPackage, "id" | "name">>) =>
        put<object>(`packages/${id}/`, token, body),

    deletePackage: async (token: string, id: number): Promise<void> => {
        await NetworkRequest<object>({ urlExtension: `api/admin/pricing/packages/${id}/`, method: DELETE, headers: headers(token) });
    },
};

export default PricingService;
