/** The number without spaces or dashes, or null when it is not a plausible USPS tracking number. Mirrors the server. */
export function cleanTrackingNumber(raw: string | null | undefined): string | null {
    const cleaned = (raw ?? '').replace(/[\s-]+/g, '');
    return /^[A-Za-z0-9]{8,40}$/.test(cleaned) ? cleaned : null;
}

/** Link to the USPS tracking page for a number, or null when the number is not usable. */
export function trackingUrl(raw: string | null | undefined): string | null {
    const number = cleanTrackingNumber(raw);
    return number ? `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(number)}` : null;
}
