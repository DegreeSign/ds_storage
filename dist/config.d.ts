import { ConfigParams, MigrationParams } from "./types";
declare let STORAGE_KEY: string, DB_NAME: string, STORE_NAME: string, ENCRYPTION_KEY: CryptoKey | undefined;
declare const 
/** Initialize configurable variables from localStorage on start */
initialiseConfig: () => Promise<void>, 
/** Configure Storage System */
configureStorage: ({ storageKey, dbName, storeName, encryptionKey }: ConfigParams) => Promise<void>, 
/** Migrate Data */
migrateSecure: ({ storedKeys, newEncryptionKey, newDbName, newStoreName, }: MigrationParams) => Promise<void>;
export { STORAGE_KEY, DB_NAME, STORE_NAME, ENCRYPTION_KEY, initialiseConfig, configureStorage, migrateSecure, };
