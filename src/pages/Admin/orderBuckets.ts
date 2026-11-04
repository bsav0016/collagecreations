export type OrderBucket = 'unactioned' | 'printed' | 'shipped' | 'problem' | 'delivered' | 'download' | 'invalid';

export interface BucketableOrder {
    orderType: string;
    printed: boolean;
    shipped: boolean;
    delivered: boolean;
    /** The server's fulfilment status. Missing from an older server, in which case it is worked out from the flags. */
    status?: string;
}

/** Which list on the admin orders page an order belongs in. */
export function bucketOf(order: BucketableOrder): OrderBucket {
    if (order.orderType === 'download') return 'download';
    // Flags that skip a step (shipped but never printed, delivered but never shipped) are for the admin to fix.
    if ((order.shipped && !order.printed) || (order.delivered && !order.shipped)) return 'invalid';
    const status = order.status ?? (order.delivered ? 'delivered' : order.shipped ? 'shipped' : order.printed ? 'printed' : 'paid');
    switch (status) {
        case 'delivered': return 'delivered';
        case 'problem': return 'problem';
        case 'shipped': return 'shipped';
        case 'printed': return 'printed';
        case 'paid': return 'unactioned';
        default: return 'invalid';
    }
}
