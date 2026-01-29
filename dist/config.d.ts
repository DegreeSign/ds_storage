import { ConfigParams, MigrationParams } from "./types";
declare const 
/** Configure Storage System */
configureStorage: ({ storageKey, dbName, storeName, encryptionKey }: ConfigParams) => Promise<void>, 
/** Get Configuration */
getConfig: () => {
    STORAGE_KEY: string;
    DB_NAME: string;
    STORE_NAME: string;
    ENCRYPTION_KEY: CryptoKey | undefined;
}, 
/** Migrate Data */
migrateSecure: ({ storedKeys, newEncryptionKey, newDbName, newStoreName, }: MigrationParams) => Promise<void>;
export { configureStorage, getConfig, migrateSecure, };
