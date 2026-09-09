import { showError } from "./config";
import { StorageParams } from "./types";

const
    /** Save data unencrypted to localStorage.
     *
     * Stores JSON under a key, sharing the browser's per-origin localStorage quota.
     *
     * - Quota up to 10 MB.
     * - Stored as JSON string. */
    saveData = <T>({ key, data }: StorageParams<T>): void => {
        try {
            if (data === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            if (showError()) console.log(`saveData failed`, e);
        };
    },
    /** Read data unencrypted from localStorage.
     *
     * Reads and parses a JSON value saved by `saveData`.
     *
     * - Quota up to 10 MB. */
    readData = <T>(key: string): T | undefined => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : undefined;
        } catch (e) {
            if (showError()) console.log(`readData failed`, e);
        };
    };

export {
    saveData,
    readData,
};