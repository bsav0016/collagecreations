import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import Footer from '../../../layout/footer/footer';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../../components/generalButton/generalButton';
import SignInPanel from '../../../components/signIn/signInPanel';
import { useCustomerAuth } from '../../../context/customerAuthContext';
import { useOrderContext } from '../../../context/orderContext';
import { CustomerOrder, getMyOrders, reorderOrder } from '../../../services/customerAuthService';

function statusOf(order: CustomerOrder): string {
    if (order.order_type === 'download') return 'Ready to download';
    if (order.delivered) return 'Delivered';
    if (order.shipped) return 'Shipped';
    if (order.printed) return 'Printed';
    return 'Processing';
}

function MyOrders(): React.ReactElement {
    const navigate = useNavigate();
    const { customerToken, customerEmail, signIn, signOut } = useCustomerAuth();
    const {
        setTemporaryImageId, setWatermarkCollage, setBaseCost, setPreviewLocked, setExpiresAt,
    } = useOrderContext();
    const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
    const [error, setError] = useState<string>('');
    const [reorderingId, setReorderingId] = useState<number | null>(null);
    const [reorderError, setReorderError] = useState<string>('');

    // Loads a past order's collage into the order flow as a fresh saved collage, then opens the preview.
    const handleReorder = async (orderId: number) => {
        if (!customerToken || reorderingId !== null) return;
        setReorderingId(orderId);
        setReorderError('');
        try {
            const claimed = await reorderOrder(customerToken, orderId);
            if (!claimed.watermark_collage) throw new Error('no preview');
            await setTemporaryImageId(claimed.temporary_image_id);
            await setWatermarkCollage(claimed.watermark_collage);
            await setBaseCost(claimed.base_cost);
            await setExpiresAt(claimed.expires_at);
            await setPreviewLocked(false);
            navigate('/preview');
        } catch (err: any) {
            if (err?.detail) {
                signOut();
                return;
            }
            setReorderError(typeof err === 'string'
                ? err
                : 'We could not start that reorder. Please try again.');
            setReorderingId(null);
        }
    };

    useEffect(() => {
        if (!customerToken) {
            setOrders(null);
            return;
        }
        let cancelled = false;
        getMyOrders(customerToken)
            .then((list) => { if (!cancelled) setOrders(list); })
            .catch((err) => {
                if (cancelled) return;
                if (err?.detail) signOut(); // stale sign-in: back to the sign-in options
                else setError('We could not load your orders. Please try again.');
            });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerToken]);

    return (
        <div>
            <NavBar />
            <div className="py-5">
                <MediumLogoHeader title="My Orders" />
                <div className="mx-auto mt-6 max-w-2xl px-4">
                    {!customerToken ? (
                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-center text-lg font-semibold text-foreground">
                                Sign in to see your orders
                            </h2>
                            <div className="mt-4">
                                <SignInPanel onSignedIn={signIn} />
                            </div>
                        </div>
                    ) : error ? (
                        <p className="text-center text-foreground">{error}</p>
                    ) : orders === null ? (
                        <p className="text-center text-muted-foreground">Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <div className="text-center">
                            <p className="text-foreground">No orders yet for {customerEmail}.</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Orders placed while you're signed in show up here.{' '}
                                <Link to="/collage" className="underline">Make a collage</Link>
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {reorderError && (
                                <li className="text-center text-sm text-destructive">{reorderError}</li>
                            )}
                            {orders.map((order) => (
                                <li
                                    key={order.id}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                                >
                                    <div>
                                        <div className="font-medium text-foreground">
                                            {order.order_type === 'download'
                                                ? 'Digital download'
                                                : `Print order${order.quantity > 1 ? ` (x${order.quantity})` : ''}`}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(order.order_date).toLocaleDateString([], { dateStyle: 'medium' })}
                                            {' · '}
                                            {statusOf(order)}
                                            {order.shipping_number && ` · Tracking ${order.shipping_number}`}
                                        </div>
                                    </div>
                                    <div className="-m-1.5 flex flex-wrap items-center">
                                        {order.download_token && (
                                            <GeneralButton
                                                text="Download"
                                                size="sm"
                                                onClick={() => navigate(`/download-access/${order.download_token}`)}
                                            />
                                        )}
                                        {order.can_reorder && (
                                            <GeneralButton
                                                text={reorderingId === order.id ? 'Opening...' : 'Reorder'}
                                                size="sm"
                                                onClick={() => handleReorder(order.id)}
                                            />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MyOrders;
