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
                DB_NAME,
                STORE_NAME,
            } = getConfig();
            return await saveDB({
                key,
                data: data ? JSON.stringify(data) : undefined,
                dbName: DB_NAME,
                storeName: STORE_NAME,
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
                    DB_NAME,
                    STORE_NAME,
                } = getConfig(),
                data = await readDB({
                    key,
                    dbName: DB_NAME,
                    storeName: STORE_NAME,
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