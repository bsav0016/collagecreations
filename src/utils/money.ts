// The backend stores every amount in cents; the admin screens show and edit dollars.
// Mirrors the backend limits: costs and shipping charges up to $60.00, selling prices up to $200.00 (a typo guard).
export const MAX_COST_CENTS = 6000;
export const MAX_PRICE_CENTS = 20000;

export const centsToDollars = (cents: number): string => (cents / 100).toFixed(2);

// 0.04712 -> "4.712" (multiplying floats gives 4.712000000000001).
export const rateToPercent = (rate: string | number): string => String(parseFloat((Number(rate) * 100).toFixed(4)));

// Returns null for anything that is not a plain non-negative amount with at most two decimals.
export const dollarsToCents = (text: string): number | null => {
    const trimmed = text.trim().replace(/^\$/, "");
    if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) return null;
    return Math.round(parseFloat(trimmed) * 100);
};
