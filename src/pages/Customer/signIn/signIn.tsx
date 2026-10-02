import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import Footer from '../../../layout/footer/footer';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import SignInPanel from '../../../components/signIn/signInPanel';
import { useCustomerAuth } from '../../../context/customerAuthContext';

function SignIn(): React.ReactElement {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { customerToken, signIn } = useCustomerAuth();

    // Only follow same-site paths, so a crafted link can't bounce someone to another site.
    const requested = params.get('next') ?? '/';
    const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';

    useEffect(() => {
        if (customerToken) navigate(next, { replace: true });
    }, [customerToken, navigate, next]);

    return (
        <div>
            <NavBar />
            <div className="py-5">
                <MediumLogoHeader title="Sign In" />
                <div className="mx-auto mt-6 max-w-md px-4">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="mb-4 text-center text-sm text-muted-foreground">
                            Sign in to keep your collages saved longer and see your orders. No password needed.
                        </p>
                        <SignInPanel onSignedIn={signIn} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SignIn;
