import React, { createContext, useState, useContext, ReactNode } from "react";
import loginService from "../services/loginService";

interface LoginData {
    username: string;
    password: string;
}

interface AuthContextType {
    userToken: string | null;
    login: (loginData: LoginData) => Promise<boolean>;
    logout: () => void;
    error: string;
}

const AuthContext = createContext<AuthContextType>({
    userToken: null,
    login: async () => false,
    logout: () => {},
    error: "",
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
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
    };

    return (
        <AuthContext.Provider value={{ userToken, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
