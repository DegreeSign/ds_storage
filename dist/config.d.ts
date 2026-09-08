import { ConfigInternal, ConfigParams, MigrationParams } from "./types";
declare const 
/** Storage System Configuration */
config: ConfigInternal, 
/** Configure Storage System */
configureStorage: ({ storageKey, dbName, storeName, encryptionKey, hideErrors, localStoragePrefix, }: ConfigParams) => Promise<void>, 
/**
 * Configure Storage System
 *
 * For following functions use `configureStorage` instead:
 *   - migrateSecure
 *   - encrypt, decrypt
 *   - saveSecure, readSecure
 */
configureStorageSync: ({ storageKey, dbName, storeName, encryptionKey, hideErrors, localStoragePrefix, }: ConfigParams) => void, 
/** Log errors */
showError: () => boolean, 
/** Migrate Data */
migrateSecure: ({ storedKeys, newEncryptionKey, newDbName, newStoreName, }: MigrationParams) => Promise<void>;
export { configureStorage, configureStorageSync, config, showError, migrateSecure, };
