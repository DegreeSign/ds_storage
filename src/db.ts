import { getConfig, showError } from "./config";
import { DBConfig, DBRead, DBSave } from "./types";

const
    /** Database (IndexedDB) operations */
    openDB = ({
        dbName,
        storeName,
        version = 1
    }: DBConfig = {}): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            dbName = dbName || getConfig().dbName;
            const request = indexedDB.open(dbName, version);
            request.onupgradeneeded = () => {
                storeName = storeName || getConfig().storeName;
                const db = request.result;
                if (!db.objectStoreNames.contains(storeName))
                    db.createObjectStore(storeName, { keyPath: 'id' });
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => {
                if (showError()) console.log(`openDB failed`, request.error);
                reject(request.error);
            };
        });
    },
    /** Save Database (uses IndexedDB)*/
    saveDB = async ({
        key,
        data,
        dbName,
        storeName,
    }: DBSave): Promise<boolean> => {
        try {
            const db = await openDB({
                dbName,
                storeName,
            });
            return new Promise(resolve => {
                const
                    transaction = db.transaction([storeName], 'readwrite'),
                    store = transaction.objectStore(storeName),
                    request = data ? store.put({ id: key, data })
                        : store.delete(key); // remove key when no data is provided
                request.onsuccess = () => resolve(true);
                request.onerror = () => {
                    if (showError()) console.log(`saveDB error`, request.error);
                    resolve(false);
                };
                db.close();
            });
        } catch (e) {
            if (showError()) console.log(`saveSecure failed`, e);
        };
        return false
    },
    /** Read Database (uses IndexedDB)*/
    readDB = async ({
        key,
        dbName,
        storeName,
    }: DBRead): Promise<string | undefined> => {
        try {
            const db = await openDB({
                dbName,
                storeName,
            });
            return new Promise(resolve => {
                const
                    transaction = db.transaction([storeName], 'readonly'),
                    store = transaction.objectStore(storeName),
                    request = store.get(key);
                request.onsuccess = () => resolve(request?.result?.data as string | undefined);
                request.onerror = () => {
                    if (showError()) console.log(`readDB error`, request.error);
                    resolve(undefined);
                };
                db.close();
            });
        } catch (e) {
            if (showError()) console.log(`readDB failed`, e);
        };
    };

export {
    openDB,
    saveDB,
    readDB,
};