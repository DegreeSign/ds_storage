import { config, showError } from "./config";
import { saveDB, readDB } from "./db";
import { encrypt, decrypt } from "./encrypt";
import { encryptSync, decryptSync } from "./encryptSync";
import { StorageParams } from "./types";

const
    /** Save secure data to IndexedDB.
     *
     * AES-GCM encrypts data to base64 and stores it as one IndexedDB record.
     *
     * - Quota up to ~1 GB.
     * - Base64 adds ~33% overhead.
     * - Buffers held in memory. */
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
    /** Read secure data from IndexedDB.
     *
     * Reads and decrypts an AES-GCM record saved by `saveSecure`.
     *
     * - Quota up to ~1 GB. */
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
    /** Save secure data to localStorage.
     *
     * XOR-encrypts data synchronously to a prefixed base64 string for localStorage.
     *
     * - Quota up to 10 MB.
     * - Base64 adds ~33% overhead.
     * - Synchronous, blocks UI. */
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
    /** Read secure data from localStorage.
     *
     * Reads and decrypts a prefixed XOR/base64 entry saved by `saveSecureSync`.
     *
     * - Quota up to 10 MB. */
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