import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralButton from '../../../components/generalButton/generalButton';
import { Input } from '../../../components/ui/input';
import { deleteMyAccount, exportMyData } from '../../../services/customerAuthService';

interface AccountDataProps {
    token: string;
    email: string;
    onSignedOut: () => void;
}

// Lets a signed-in customer download everything we hold about them, or delete their account.
function AccountData({ token, email, onSignedOut }: AccountDataProps): React.ReactElement {
    const navigate = useNavigate();
    const [busy, setBusy] = useState<'export' | 'delete' | null>(null);
    const [confirming, setConfirming] = useState<boolean>(false);
    const [typedEmail, setTypedEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const failed = (err: any, fallback: string) => {
        if (err?.detail) {
            onSignedOut();
            return;
        }
        setError(typeof err === 'string' ? err : fallback);
    };

    const handleExport = async () => {
        if (busy) return;
        setBusy('export');
        setError('');
        try {
            const data = await exportMyData(token);
            const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'collage-creations-my-data.json';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            failed(err, 'We could not prepare your data. Please try again.');
        } finally {
            setBusy(null);
        }
    };

    const handleDelete = async () => {
        if (busy) return;
        setBusy('delete');
        setError('');
        try {
            await deleteMyAccount(token, typedEmail);
            onSignedOut();
            navigate('/');
        } catch (err) {
            failed(err, 'We could not delete your account. Please try again.');
            setBusy(null);
        }
    };

    const emailMatches = typedEmail.trim().toLowerCase() === email.toLowerCase();

    return (
        <section className="mt-10 border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground">Your data</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                Download a copy of what we hold about you, or delete your account. Deleting removes your
                saved collages and signs you out everywhere. Orders you've already placed are kept for
                fulfillment and accounting, but are no longer linked to an account.
            </p>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            <div className="-mx-1.5 mt-3 flex flex-wrap items-center">
                <GeneralButton
                    text={busy === 'export' ? 'Preparing...' : 'Download my data'}
                    size="sm"
                    variant="ghost"
                    disabled={busy !== null}
                    onClick={handleExport}
                />
                {!confirming && (
                    <GeneralButton
                        text="Delete my account"
                        size="sm"
                        variant="ghost"
                        disabled={busy !== null}
                        onClick={() => setConfirming(true)}
                    />
                )}
            </div>
            {confirming && (
                <div className="mt-3 rounded-xl border border-border bg-card p-4">
                    <label className="text-sm text-foreground" htmlFor="confirm-delete-email">
                        To confirm, type your email address ({email}):
                    </label>
                    <Input
                        id="confirm-delete-email"
                        className="mt-2"
                        type="email"
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}
                        autoComplete="off"
                    />
                    <div className="-mx-1.5 mt-2 flex flex-wrap items-center">
                        <GeneralButton
                            text={busy === 'delete' ? 'Deleting...' : 'Permanently delete my account'}
                            size="sm"
                            disabled={!emailMatches || busy !== null}
                            onClick={handleDelete}
                        />
                        <GeneralButton
                            text="Cancel"
                            size="sm"
                            variant="ghost"
                            disabled={busy !== null}
                            onClick={() => { setConfirming(false); setTypedEmail(''); }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default AccountData;
