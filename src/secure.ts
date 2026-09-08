import { config, showError } from "./config";
import { saveDB, readDB } from "./db";
import { encrypt, decrypt } from "./encrypt";
import { encryptSync, decryptSync } from "./encryptSync";
import { StorageParams } from "./types";

const
    /** Save Secure Data (IndexedDB) - encrypted */
    saveSecure = async <T>({
        key,
        data
    }: StorageParams<T>): Promise<boolean> => {
        try {
            return await saveDB({
                key,
                data: data ? await encrypt(data) : undefined,
                dbName: config.dbName,
                storeName: config.storeName,
            });
        } catch (e) {
            if (showError()) console.log(`saveSecure failed`, e);
        };
        return false
    },
    /** Read Secure Data (IndexedDB) - encrypted */
    readSecure = async <T>(
        key: string
    ): Promise<T | undefined> => {
        try {
            const data = await readDB({
                key,
                dbName: config.dbName,
                storeName: config.storeName,
            });
            return data ? await decrypt<T>(data) : undefined;
        } catch (e) {
            if (showError()) console.log(`readSecure failed`, e);
        };
    },
    /** Save Secure Data (localStorage) - encrypted */
    saveSecureSync = <T>({
        key,
        data
    }: StorageParams<T>): boolean => {
        try {
            if (data === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, encryptSync(data) ?? ``);
            return true;
        } catch (e) {
            if (showError()) console.log(`saveSecureSync failed`, e);
        };
        return false;
    },
    /** Read Secure Data (localStorage) - encrypted */
    readSecureSync = <T>(
        key: string
    ): T | undefined => {
        try {
            const item = localStorage.getItem(key);
            return item ? decryptSync<T>(item) : undefined;
        } catch (e) {
            if (showError()) console.log(`readSecureSync failed`, e);
        };
    };

export {
    saveSecure,
    readSecure,
    saveSecureSync,
    readSecureSync,
};