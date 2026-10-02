import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { CustomerSession } from "../services/customerAuthService";

// Shopper sign-in (Google / Microsoft / emailed code). Separate from the admin AuthContext, whose
// token is a different kind of credential and must never be mixed with this one.
const STORAGE_KEY = "customerSession";

interface CustomerAuthContextType {
    customerToken: string | null;
    customerEmail: string | null;
    signIn: (session: CustomerSession) => void;
    signOut: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
    customerToken: null,
    customerEmail: null,
    signIn: () => {},
    signOut: () => {},
});

function loadSession(): CustomerSession | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CustomerSession) : null;
    } catch {
        return null; // storage blocked or corrupt: behave as signed out
    }
}

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<CustomerSession | null>(loadSession);

    const signIn = useCallback((next: CustomerSession) => {
        setSession(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Still signed in for this visit; just not remembered.
        }
    }, []);

    const signOut = useCallback(() => {
        setSession(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // nothing to clean up
        }
    }, []);

    return (
        <CustomerAuthContext.Provider
            value={{ customerToken: session?.token ?? null, customerEmail: session?.email ?? null, signIn, signOut }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
