import React, { createContext, useState, useCallback, ReactNode } from "react";

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
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] max-w-[50%] w-auto bg-card text-card-foreground border border-border rounded-[5px] shadow-lg p-[15px] box-border">
                        {toasts.map((toast) => (
                            <div key={toast.id}>
                                <label className="text-base">{toast.message}</label>
                                <div className="flex justify-end mt-[5px]">
                                    {toast.okCallback && (
                                        <button
                                            className="font-normal py-[10px] px-[15px] bg-secondary text-secondary-foreground border border-border rounded cursor-pointer text-sm transition-colors hover:bg-secondary/80"
                                            onClick={() => removeToast(toast.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        className="font-bold py-[10px] px-[15px] bg-primary text-primary-foreground border-none rounded cursor-pointer text-sm transition-colors ml-[5px] hover:bg-primary/90"
                                        onClick={() => {
                                            if (toast.okCallback) {
                                                toast.okCallback();
                                            }
                                            removeToast(toast.id);
                                        }}
                                    >
                                        {toast.okCallback ? "OK" : "Dismiss"}
                                    </button>
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
