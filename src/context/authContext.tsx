import React, { createContext, useState, useContext, ReactNode } from "react";
import loginService from "../services/loginService";

interface LoginData {
    username: string;
    password: string;
}

interface AuthContextType {
    userToken: string | null;
    isSuperuser: boolean;
    login: (loginData: LoginData) => Promise<boolean>;
    logout: () => void;
    error: string;
}

const AuthContext = createContext<AuthContextType>({
    userToken: null,
    isSuperuser: false,
    login: async () => false,
    logout: () => {},
    error: "",
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [error, setError] = useState("");

    const login = async (loginData: LoginData): Promise<boolean> => {
        if (loginData.username === "" || !loginData.username) {
            setError("Enter username");
            return false;
        } else if (loginData.password === "" || !loginData.password) {
            setError("Enter password");
            return false;
        }
        try {
            setError("");
            const data = await loginService(loginData);
            setUserToken(data.token);
            setIsSuperuser(Boolean(data.is_superuser));
            return true;
        } catch (err) {
            if (err instanceof Error && err.message === "Invalid username/password") {
                setError(err.message);
            } else {
                setError("Network error");
            }
            return false;
        }
    };

    const logout = () => {
        setUserToken(null);
        setIsSuperuser(false);
    };

    return (
        <AuthContext.Provider value={{ userToken, isSuperuser, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
