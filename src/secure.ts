import { config, showError } from "./config";
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
    /** Read Secure Data (uses IndexedDB)*/
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
    };

export {
    saveSecure,
    readSecure,
};