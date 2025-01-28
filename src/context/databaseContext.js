import React, { createContext, useContext, useState } from 'react';

const LocalDatabaseContext = createContext();

export const useLocalDatabase = () => {
    return useContext(LocalDatabaseContext);
}

export const LocalDatabaseProvider = ({ children }) => {
    const [db, setDB] = useState(null);

    const openDatabase = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ImageDB', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('images')) {
                    db.createObjectStore('images', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                setDB(event.target.result);
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error opening IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        })
    };

    const setVariable = async (key, value) => {
        try {
            let currentDB = null;
            if (db !== null) {
                currentDB = db
            }
            else {
                try {
                    currentDB = await openDatabase();
                    setDB(currentDB);
                } catch (error) {
                    throw new Error(error);
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
    }

    const loadVariable = async (key) => {
        try {
            let currentDB = null;
            if (db !== null) {
                currentDB = db
            }
            else {
                try {
                    currentDB = await openDatabase();
                    setDB(currentDB);
                } catch (error) {
                    throw new Error(error);
                }
            }

            return new Promise((resolve, reject) => {
                const transaction = currentDB.transaction(["images"], "readonly");
                const store = transaction.objectStore("images");
                const request = store.get(key);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        if (key in result) {
                            resolve(result[key]);
                        } else {
                            reject(new Error(`${key} not found in store`));
                        }
                    } else {
                        reject(new Error(`Could not get variable with key: ${key}`));
                    }
                };

                request.onerror = () => {
                    reject(new Error(`Error retreiving key: ${key}`));
                };
            });
        } catch (error) {
            throw new Error(`Error opening IndexedDB: ${error}`);
        }
    }

    const deleteVariable = async (key) => {
        try {
            if (db === null) {
                throw new Error ("Database not initialized")
            }
            const transaction = db.transaction(["images"], "readwrite");
            const store = transaction.objectStore("images");
            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`Successfully deleted key: ${key}`)
            };

            request.onerror = () => {
                throw new Error(`Error deleting key: ${key}`)
            };

            transaction.oncomplete = () => {
                console.log('Transaction for key deletion completed');
            }

            transaction.onerror = () => {
                throw new Error('Did not complete transaction for key deletion')
            }
        } catch (error) {
            console.error(`Error in delete variable: ${error}`)
        }
    }

    return (
        <LocalDatabaseContext.Provider value={{ db, setVariable, loadVariable, deleteVariable }}>
            {children}
        </LocalDatabaseContext.Provider>
    )
}
