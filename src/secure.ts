import { getConfig } from "./config";
import { saveDB, readDB } from "./db";
import { encrypt, decrypt } from "./encrypt";
import { StorageParams } from "./types";

const
    /** Save Secure Data (uses IndexedDB)*/
    saveSecure = async <T>({
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
                data: data ? await encrypt(data) : undefined,
                dbName,
                storeName,
            });
        } catch (e) {
            console.log(`saveSecure failed`, e);
        };
        return false
    },
    /** Read Secure Data (uses IndexedDB)*/
    readSecure = async <T>(
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
            return data ? await decrypt<T>(data) : undefined;
        } catch (e) {
            console.log(`readSecure failed`, e);
        };
    };

export {
    saveSecure,
    readSecure,
};