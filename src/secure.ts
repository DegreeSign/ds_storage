import { DB_NAME, STORE_NAME } from "./config";
import { encrypt, decrypt } from "./encrypt";
import { DBConfig, DBRead, DBSave, StorageParams } from "./types";

const
    /** Database (IndexedDB) operations */
    openDB = ({
        dbName,
        storeName,
        version = 1
    }: DBConfig = {}): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            dbName = dbName || DB_NAME;
            const request = indexedDB.open(dbName, version);
            request.onupgradeneeded = () => {
                storeName = storeName || STORE_NAME;
                const db = request.result;
                if (!db.objectStoreNames.contains(storeName))
                    db.createObjectStore(storeName, { keyPath: 'id' });
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => {
                console.log(`openDB error`, request.error);
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
                    console.log(`saveDB error`, request.error);
                    resolve(false);
                };
                db.close();
            });
        } catch (error) {
            console.log(`saveSecure failed`, error);
            return false
        };
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
                    console.log(`readDB error`, request.error);
                    resolve(undefined);
                };
                db.close();
            });
        } catch (error) {
            console.log(`readDB failed`, error);
            return;
        };
    },
    /** Save Secure Data (uses IndexedDB)*/
    saveSecure = async <T>({
        key,
        data
    }: StorageParams<T>): Promise<boolean> => await saveDB({
        key,
        data: data ? await encrypt(data) : undefined,
        dbName: DB_NAME,
        storeName: STORE_NAME,
    }),
    /** Read Secure Data (uses IndexedDB)*/
    readSecure = async <T>(
        key: string
    ): Promise<T | undefined> => {
        try {
            const data = await readDB({
                key,
                dbName: DB_NAME,
                storeName: STORE_NAME,
            });
            return data ? await decrypt<T>(data) : undefined;
        } catch (error) {
            console.log(`readSecure failed`, error);
            return;
        };
    };

export {
    openDB,
    saveDB,
    readDB,
    saveSecure,
    readSecure,
};