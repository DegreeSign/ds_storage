import { config, showError } from "./config";
import { saveDB, readDB } from "./db";
import { StorageParams } from "./types";

const
    /** Save Large Data (IndexedDB) - unencrypted */
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
    /** Read Large Data (IndexedDB) - unencrypted */
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