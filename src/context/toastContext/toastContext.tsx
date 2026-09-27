import React, { createContext, useState, useCallback, ReactNode } from "react";
import { Button } from "../../components/ui/button";

interface Toast {
    id: number;
    message: string;
    type: string;
    okCallback: (() => void) | null;
}

type AddToastFn = (message: string, type?: string, okCallback?: (() => void) | null) => void;

const ToastContext = createContext<AddToastFn | null>(null);
export const toastRef = React.createRef<AddToastFn>();

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast: AddToastFn = useCallback((message, type = "info", okCallback = null) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type, okCallback }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    (toastRef as React.MutableRefObject<AddToastFn>).current = addToast;

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            {toasts.length > 0 && (
                <div>
                    <div className="fixed top-0 left-0 w-full h-full bg-black/30 dark:bg-black/60 z-[9998]" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-sm bg-card text-card-foreground border border-border rounded-xl shadow-lg p-6 box-border">
                        {toasts.map((toast) => (
                            <div key={toast.id}>
                                <p className="text-base font-medium">{toast.message}</p>
                                <div className="flex justify-end gap-2 mt-5">
                                    {toast.okCallback && (
                                        <Button variant="outline" onClick={() => removeToast(toast.id)}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => {
                                            if (toast.okCallback) {
                                                toast.okCallback();
                                            }
                                            removeToast(toast.id);
                                        }}
                                    >
                                        {toast.okCallback ? "OK" : "Dismiss"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export default ToastContext;
