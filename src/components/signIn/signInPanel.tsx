import React, { useEffect, useRef, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import GeneralButton from "../generalButton/generalButton";
import TextInput from "../textInput/textInput";
import { GOOGLE_CLIENT_ID, MICROSOFT_CLIENT_ID } from "../../utils/constants/constants";
import {
    CustomerSession,
    requestEmailCode,
    signInWithGoogle,
    signInWithMicrosoft,
    verifyEmailCode,
} from "../../services/customerAuthService";

interface SignInPanelProps {
    onSignedIn: (session: CustomerSession) => void;
}

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

let msalInstance: PublicClientApplication | null = null;
async function getMsal(): Promise<PublicClientApplication> {
    if (!msalInstance) {
        // "consumers" = personal Microsoft accounts only, which is all the backend accepts.
        msalInstance = new PublicClientApplication({
            auth: {
                clientId: MICROSOFT_CLIENT_ID,
                authority: "https://login.microsoftonline.com/consumers",
                redirectUri: window.location.origin,
            },
            cache: { cacheLocation: "sessionStorage" },
        });
        await msalInstance.initialize();
    }
    return msalInstance;
}

function loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).google?.accounts?.id) return resolve();
        const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);
        const script = (existing as HTMLScriptElement) ?? document.createElement("script");
        script.addEventListener("load", () => resolve());
        script.addEventListener("error", () => reject(new Error("Google sign-in could not load")));
        if (!existing) {
            script.src = GOOGLE_SCRIPT;
            script.async = true;
            document.head.appendChild(script);
        }
    });
}

function errorText(error: unknown, fallback: string): string {
    return typeof error === "string" ? error : fallback;
}

export function SignInPanel({ onSignedIn }: SignInPanelProps): React.ReactElement {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    // Latest callback without re-initialising the Google button on every render.
    const onSignedInRef = useRef(onSignedIn);
    onSignedInRef.current = onSignedIn;

    useEffect(() => {
        let cancelled = false;
        loadGoogleScript()
            .then(() => {
                if (cancelled || !googleButtonRef.current) return;
                const google = (window as any).google;
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response: { credential: string }) => {
                        setError("");
                        setBusy(true);
                        try {
                            onSignedInRef.current(await signInWithGoogle(response.credential));
                        } catch (err) {
                            setError(errorText(err, "Google sign-in failed. Please try again."));
                        } finally {
                            setBusy(false);
                        }
                    },
                });
                google.accounts.id.renderButton(googleButtonRef.current, {
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    width: 280,
                });
            })
            .catch(() => {
                // Blocked or offline: the Microsoft and email options still work.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const run = async (action: () => Promise<void>, fallback: string) => {
        setError("");
        setBusy(true);
        try {
            await action();
        } catch (err) {
            setError(errorText(err, fallback));
        } finally {
            setBusy(false);
        }
    };

    const clickedMicrosoft = () =>
        run(async () => {
            const msal = await getMsal();
            const result = await msal.loginPopup({ scopes: ["openid", "email", "profile"] });
            onSignedIn(await signInWithMicrosoft(result.idToken));
        }, "Microsoft sign-in failed. Please try again.");

    const clickedSendCode = () =>
        run(async () => {
            await requestEmailCode(email.trim());
            setCodeSent(true);
        }, "We couldn't send the code. Please check the address and try again.");

    const clickedVerify = () =>
        run(async () => {
            onSignedIn(await verifyEmailCode(email.trim(), code.trim()));
        }, "That code is invalid or has expired.");

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div ref={googleButtonRef} className="min-h-[44px]" />

            <GeneralButton
                onClick={clickedMicrosoft}
                text="Continue with Microsoft"
                variant="ghost"
                disabled={busy}
            />

            <div className="flex w-full max-w-xs items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or use your email
                <div className="h-px flex-1 bg-border" />
            </div>

            {!codeSent ? (
                <form
                    className="flex w-full max-w-xs flex-col items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        clickedSendCode();
                    }}
                >
                    <TextInput
                        type="email"
                        id="signin-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <GeneralButton type="submit" text="Email me a code" disabled={busy || !email.trim()} />
                </form>
            ) : (
                <form
                    className="flex w-full max-w-xs flex-col items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        clickedVerify();
                    }}
                >
                    <p className="text-sm text-muted-foreground text-center">
                        We sent a 6-digit code to {email.trim()}. It expires in 10 minutes.
                    </p>
                    <TextInput
                        id="signin-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        required
                    />
                    <GeneralButton type="submit" text="Verify code" disabled={busy || code.trim().length !== 6} />
                    <button
                        type="button"
                        className="text-xs text-muted-foreground underline"
                        onClick={() => {
                            setCodeSent(false);
                            setCode("");
                        }}
                    >
                        Use a different email
                    </button>
                </form>
            )}

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </div>
    );
}

export default SignInPanel;
