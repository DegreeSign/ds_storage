import { ConfigParams, MigrationParams } from "./types";
declare const 
/** Configure Storage System */
configureStorage: ({ storageKey, dbName, storeName, encryptionKey, hideErrors }: ConfigParams) => Promise<void>, 
/** Get Configuration */
getConfig: () => {
    storageKey: string;
    dbName: string;
    storeName: string;
    ENCRYPTION_KEY: CryptoKey | undefined;
    hideErrors: boolean;
}, showError: () => boolean, 
/** Migrate Data */
migrateSecure: ({ storedKeys, newEncryptionKey, newDbName, newStoreName, }: MigrationParams) => Promise<void>;
export { configureStorage, getConfig, showError, migrateSecure, };
