import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralButton from '../../../components/generalButton/generalButton';
import { SavedCollage, deleteSavedCollage, getSavedCollages } from '../../../services/customerAuthService';

interface SavedCollagesProps {
    token: string;
    onSignedOut: () => void;
}

// Collages the customer made while signed in and hasn't ordered yet. They are deleted automatically
// after a week; this lists them with the date so nothing is lost by forgetting the reminder email.
function SavedCollages({ token, onSignedOut }: SavedCollagesProps): React.ReactElement | null {
    const navigate = useNavigate();
    const [collages, setCollages] = useState<SavedCollage[]>([]);
    const [error, setError] = useState<string>('');
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        getSavedCollages(token)
            .then((list) => { if (!cancelled) setCollages(list); })
            .catch((err) => {
                if (cancelled) return;
                if (err?.detail) onSignedOut();
                // Any other failure: the orders above still work, so just don't show this section.
            });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleDelete = async (collage: SavedCollage) => {
        if (busyId || !window.confirm('Delete this saved collage? This cannot be undone.')) return;
        setBusyId(collage.id);
        setError('');
        try {
            await deleteSavedCollage(token, collage.id);
            setCollages((current) => current.filter((c) => c.id !== collage.id));
        } catch (err: any) {
            if (err?.detail) {
                onSignedOut();
                return;
            }
            setError('We could not delete that collage. Please try again.');
        } finally {
            setBusyId(null);
        }
    };

    if (collages.length === 0) return null;

    return (
        <section className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">Saved collages</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                Collages you haven't ordered yet. Each is deleted automatically on the date shown.
            </p>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            <ul className="mt-3 flex flex-col gap-3">
                {collages.map((collage) => (
                    <li
                        key={collage.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                    >
                        <div>
                            <div className="font-medium text-foreground">
                                {collage.width} x {collage.height} in collage
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Saved until {new Date(collage.expires_at).toLocaleDateString([], { dateStyle: 'medium' })}
                            </div>
                        </div>
                        <div className="-m-1.5 flex flex-wrap items-center">
                            <GeneralButton
                                text="Open"
                                size="sm"
                                onClick={() => navigate(`/saved-collage/${collage.id}`)}
                            />
                            <GeneralButton
                                text={busyId === collage.id ? 'Deleting...' : 'Delete'}
                                size="sm"
                                variant="ghost"
                                disabled={busyId !== null}
                                onClick={() => handleDelete(collage)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default SavedCollages;
