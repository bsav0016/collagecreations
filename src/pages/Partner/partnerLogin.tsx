import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "../../assets/medium-logo.png";
import GeneralButton from "../../components/generalButton/generalButton";
import { Input } from "../../components/ui/input";
import { usePartnerAuth } from "../../context/partnerAuthContext";
import PartnerService from "../../services/PartnerService";

function PartnerLogin(): React.ReactElement {
    const { session, signIn } = usePartnerAuth();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState("");

    if (session) return <Navigate to="/partner" replace />;

    const run = async (action: () => Promise<void>) => {
        setError("");
        setWorking(true);
        try {
            await action();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setWorking(false);
        }
    };

    const sendCode = () => run(async () => {
        await PartnerService.requestCode(email.trim());
        setCodeSent(true);
    });

    const verify = () => run(async () => {
        signIn(await PartnerService.verifyCode(email.trim(), code.trim()));
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-10">
            <img src={Logo} alt="Collage Creations Logo" className="block h-16 w-auto" />
            <div className="text-center">
                <h1 className="text-2xl font-bold">Partner sign in</h1>
                <p className="text-sm text-muted-foreground mt-1">See the orders and commissions from your discount code</p>
            </div>

            <form className="flex flex-col gap-3 w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); codeSent ? verify() : sendCode(); }}>
                <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Email address</span>
                    <Input type="email" aria-label="Email address" value={email} disabled={working || codeSent}
                        maxLength={254} onChange={(e) => setEmail(e.target.value)} />
                </label>
                {codeSent && (
                    <>
                        <p className="text-sm text-muted-foreground">
                            If that address has partner access, a 6-digit code is on its way. It expires in 10 minutes.
                        </p>
                        <label className="flex flex-col gap-1 text-sm">
                            <span className="text-muted-foreground">Code</span>
                            <Input aria-label="Code" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                                value={code} disabled={working} onChange={(e) => setCode(e.target.value)} />
                        </label>
                    </>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <GeneralButton type="submit" fullWidth disabled={working || !email.trim() || (codeSent && code.trim().length !== 6)}
                    text={codeSent ? (working ? "Checking..." : "Sign in") : (working ? "Sending..." : "Email me a code")} />
                {codeSent && (
                    <GeneralButton variant="ghost" fullWidth disabled={working} text="Use a different email"
                        onClick={() => { setCodeSent(false); setCode(""); setError(""); }} />
                )}
            </form>
        </div>
    );
}

export default PartnerLogin;
