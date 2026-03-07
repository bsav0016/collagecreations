import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocalDatabaseContextType {
    db: IDBDatabase | null;
    setVariable: (key: string, value: unknown) => Promise<void>;
    loadVariable: <T>(key: string) => Promise<T>;
    deleteVariable: (key: string) => Promise<void>;
}

const LocalDatabaseContext = createContext<LocalDatabaseContextType | undefined>(undefined);

export const useLocalDatabase = (): LocalDatabaseContextType => {
    const context = useContext(LocalDatabaseContext);
    if (!context) {
        throw new Error("useLocalDatabase must be used within a LocalDatabaseProvider");
    }
    return context;
};

interface LocalDatabaseProviderProps {
    children: ReactNode;
}

export const LocalDatabaseProvider: React.FC<LocalDatabaseProviderProps> = ({ children }) => {
    const [db, setDB] = useState<IDBDatabase | null>(null);

    const openDatabase = async (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("ImageDB", 1);

            request.onupgradeneeded = (event) => {
                const database = (event.target as IDBOpenDBRequest).result;
                if (!database.objectStoreNames.contains("images")) {
                    database.createObjectStore("images", { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                const database = (event.target as IDBOpenDBRequest).result;
                setDB(database);
                resolve(database);
            };

            request.onerror = (event) => {
                console.error("Error opening IndexedDB:", (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    };

    const setVariable = async (key: string, value: unknown): Promise<void> => {
        try {
            let currentDB: IDBDatabase | null = null;
            if (db !== null) {
                currentDB = db;
            } else {
                try {
                    currentDB = await openDatabase();
                    setDB(currentDB);
                } catch (error) {
                    throw new Error(String(error));
                }
            }

            const transaction = currentDB.transaction(["images"], "readwrite");
            const store = transaction.objectStore("images");
            store.put({ id: key, [key]: value });

            transaction.oncomplete = () => {
                console.log("Variable saved to IndexedDB");
            };
            transaction.onerror = () => {
                console.error("Error saving variable to IndexedDB");
            };
        } catch (error) {
            console.error("IndexedDB error:", error);
        }
    };

    const loadVariable = async <T,>(key: string): Promise<T> => {
        try {
            let currentDB: IDBDatabase | null = null;
            if (db !== null) {
                currentDB = db;
            } else {
                try {
                    currentDB = await openDatabase();
                    setDB(currentDB);
                } catch (error) {
                    throw new Error(String(error));
                }
            }

            return new Promise((resolve, reject) => {
                const transaction = currentDB!.transaction(["images"], "readonly");
                const store = transaction.objectStore("images");
                const request = store.get(key);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        if (key in result) {
                            resolve(result[key] as T);
                        } else {
                            reject(new Error(`${key} not found in store`));
                        }
                    } else {
                        reject(new Error(`Could not get variable with key: ${key}`));
                    }
                };

                request.onerror = () => {
                    reject(new Error(`Error retrieving key: ${key}`));
                };
            });
        } catch (error) {
            throw new Error(`Error opening IndexedDB: ${error}`);
        }
    };

    const deleteVariable = async (key: string): Promise<void> => {
        try {
            if (db === null) {
                throw new Error("Database not initialized");
            }
            const transaction = db.transaction(["images"], "readwrite");
            const store = transaction.objectStore("images");
            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`Successfully deleted key: ${key}`);
            };

            request.onerror = () => {
                throw new Error(`Error deleting key: ${key}`);
            };

            transaction.oncomplete = () => {
                console.log("Transaction for key deletion completed");
            };

            transaction.onerror = () => {
                throw new Error("Did not complete transaction for key deletion");
            };
        } catch (error) {
            console.error(`Error in delete variable: ${error}`);
        }
    };

    return (
        <LocalDatabaseContext.Provider value={{ db, setVariable, loadVariable, deleteVariable }}>
            {children}
        </LocalDatabaseContext.Provider>
    );
};
