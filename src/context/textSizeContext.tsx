import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "small" | "medium" | "large";

interface TextSizeContextType {
    textSize: TextSize;
    setTextSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

const TEXT_SIZE_KEY = "text-size";

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
    const [textSize, setTextSizeState] = useState<TextSize>("medium");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem(TEXT_SIZE_KEY) as TextSize | null;
        if (stored && ["small", "medium", "large"].includes(stored)) {
            setTextSizeState(stored);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        // Apply CSS class to html element
        const root = document.documentElement;
        root.classList.remove("text-size-small", "text-size-medium", "text-size-large");
        root.classList.add(`text-size-${textSize}`);
        
        // Persist to localStorage
        localStorage.setItem(TEXT_SIZE_KEY, textSize);
    }, [textSize, mounted]);

    const setTextSize = (size: TextSize) => {
        setTextSizeState(size);
    };

    return (
        <TextSizeContext.Provider value={{ textSize, setTextSize }}>
            {children}
        </TextSizeContext.Provider>
    );
}

export function useTextSize() {
    const context = useContext(TextSizeContext);
    if (context === undefined) {
        throw new Error("useTextSize must be used within a TextSizeProvider");
    }
    return context;
}
