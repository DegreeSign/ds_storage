import { getConfig } from "./config";
import { saveDB, readDB } from "./db";
import { StorageParams } from "./types";

const
    /** Save Large Data (uses IndexedDB)*/
    saveLarge = async <T>({
        key,
        data
    }: StorageParams<T>): Promise<boolean> => {
        try {
            const {
                dbName,
                storeName,
            } = getConfig();
            return await saveDB({
                key,
                data: data ? JSON.stringify(data) : undefined,
                dbName,
                storeName,
            })
        } catch (e) {
            console.log(`saveLarge failed`, e);
        };
        return false
    },
    /** Read Large Data (uses IndexedDB)*/
    readLarge = async <T>(
        key: string
    ): Promise<T | undefined> => {
        try {
            const
                {
                    dbName,
                    storeName,
                } = getConfig(),
                data = await readDB({
                    key,
                    dbName,
                    storeName,
                });
            return data ? JSON.parse(data) : undefined;
        } catch (e) {
            console.log(`readLarge failed`, e);
        };
    };

export {
    saveLarge,
    readLarge,
};