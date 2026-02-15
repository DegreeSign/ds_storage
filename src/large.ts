import { config, showError } from "./config";
import { saveDB, readDB } from "./db";
import { StorageParams } from "./types";

const
    cachedData: {
        [key: string]: any
    } = {},
    /** Save Large Data (uses IndexedDB)*/
    saveLarge = async <T>({
        key,
        data
    }: StorageParams<T>): Promise<boolean> => {
        try {

            // update cache
            if (config.cacheStorage && data)
                cachedData[key] = data;

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
    /** Read Large Data (uses IndexedDB)*/
    readLarge = async <T>(
        key: string
    ): Promise<T | undefined> => {
        try {

            // retrieve cache
            if (config.cacheStorage && cachedData[key])
                return cachedData[key];

            const
                raw = await readDB({
                    key,
                    dbName: config.dbName,
                    storeName: config.storeName,
                }),
                data = raw ? JSON.parse(raw) : undefined;

            // update cache
            if (config.cacheStorage && data)
                cachedData[key] = data;

            return data
        } catch (e) {
            if (showError()) console.log(`readLarge failed`, e);
        };
    };

export {
    saveLarge,
    readLarge,
};