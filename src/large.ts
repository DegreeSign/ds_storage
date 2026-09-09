import { config, showError } from "./config";
import { saveDB, readDB } from "./db";
import { StorageParams } from "./types";

const
    /** Save large data to IndexedDB.
     *
     * Stores a JSON string as one record, subject to the browser's per-origin quota.
     *
     * - No fixed size cap.
     * - Quota up to ~1 GB.
     * - Record held in memory. */
    saveLarge = async <T>({
        key,
        data
    }: StorageParams<T>): Promise<boolean> => {
        try {
            return await saveDB({
                key,
                data: data ? JSON.stringify(data) : undefined,
                dbName: config.dbName,
                storeName: config.storeName,
            });
        } catch (e) {
            if (showError()) console.log(`saveLarge failed`, e);
        };
        return false
    },
    /** Read large data from IndexedDB.
     *
     * Reads and parses a JSON record saved by `saveLarge`.
     *
     * - Quota up to ~1 GB. */
    readLarge = async <T>(
        key: string
    ): Promise<T | undefined> => {
        try {
            const raw = await readDB({
                key,
                dbName: config.dbName,
                storeName: config.storeName,
            });
            return raw ? JSON.parse(raw) : undefined;
        } catch (e) {
            if (showError()) console.log(`readLarge failed`, e);
        };
    };

export {
    saveLarge,
    readLarge,
};