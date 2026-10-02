import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import Footer from '../../../layout/footer/footer';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import SignInPanel from '../../../components/signIn/signInPanel';
import { useCustomerAuth } from '../../../context/customerAuthContext';
import { useOrderContext } from '../../../context/orderContext';
import { claimCollage } from '../../../services/customerAuthService';

// Target of the "your collage is still waiting" email. Signs the customer in if needed, reloads
// their saved collage into the order flow, and sends them to the preview.
function SavedCollage(): React.ReactElement {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { customerToken, signIn, signOut } = useCustomerAuth();
    const {
        setTemporaryImageId, setWatermarkCollage, setBaseCost, setPreviewLocked, setExpiresAt,
    } = useOrderContext();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!customerToken || !id) return;
        let cancelled = false;
        claimCollage(customerToken, id)
            .then(async (claimed) => {
                if (cancelled || !claimed.watermark_collage) return;
                await setTemporaryImageId(claimed.temporary_image_id);
                await setWatermarkCollage(claimed.watermark_collage);
                await setBaseCost(claimed.base_cost);
                await setExpiresAt(claimed.expires_at);
                await setPreviewLocked(false);
                navigate('/preview', { replace: true });
            })
            .catch((err) => {
                if (cancelled) return;
                if (err?.detail) signOut(); // stale sign-in: show the sign-in options again
                setError(typeof err === 'string'
                    ? err
                    : 'We could not open this collage. Please sign in again.');
            });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerToken, id]);

    return (
        <div>
            <NavBar />
            <div className="py-5">
                <MediumLogoHeader title="Your Saved Collage" />
                <div className="mx-auto mt-6 max-w-md px-4">
                    {error ? (
                        <div className="text-center">
                            <p className="text-foreground">{error}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Saved collages are only kept for a limited time.{' '}
                                <Link to="/collage" className="underline">Make a new one</Link>
                            </p>
                        </div>
                    ) : customerToken ? (
                        <p className="text-center text-muted-foreground">Opening your collage...</p>
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-center text-lg font-semibold text-foreground">
                                Sign in to open your collage
                            </h2>
                            <p className="mt-1 mb-4 text-center text-sm text-muted-foreground">
                                Use the same account you used when you made it.
                            </p>
                            <SignInPanel onSignedIn={signIn} />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SavedCollage;
