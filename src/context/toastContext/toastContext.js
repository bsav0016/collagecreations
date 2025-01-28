import React, { createContext, useState, useCallback } from "react";
import styles from './toast.module.css';

const ToastContext = createContext();
export const toastRef = React.createRef();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", okCallback = null) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, okCallback }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  toastRef.current = addToast;

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.length > 0 &&
      <div>
        <div className={styles.toastOverlay} />
        <div className={styles.toastContainer}>
          {toasts.map((toast) => (
            <div key={toast.id}>
              <label>{toast.message}</label>
              <div className={styles.buttonContainer}>
                {toast.okCallback && (
                  <button 
                    className={styles.boldButton} 
                    onClick={() => removeToast(toast.id)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className={toast.okCallback ? styles.dimButton : styles.boldButton}
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
      }
    </ToastContext.Provider>
  );
};
