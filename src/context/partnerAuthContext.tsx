import React, { createContext, useContext, useState, ReactNode } from "react";
import { PartnerSession } from "../services/PartnerService";

interface PartnerAuthContextType {
    session: PartnerSession | null;
    signIn: (session: PartnerSession) => void;
    signOut: () => void;
}

const PartnerAuthContext = createContext<PartnerAuthContextType>({
    session: null,
    signIn: () => {},
    signOut: () => {},
});

// Kept in memory only, like the admin login: closing or reloading the page signs the partner out.
export const PartnerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<PartnerSession | null>(null);
    return (
        <PartnerAuthContext.Provider value={{ session, signIn: setSession, signOut: () => setSession(null) }}>
            {children}
        </PartnerAuthContext.Provider>
    );
};

export const usePartnerAuth = () => useContext(PartnerAuthContext);
