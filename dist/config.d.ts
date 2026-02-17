import { ConfigInternal, ConfigParams, MigrationParams } from "./types";
declare const 
/** Storage System Configuration */
config: ConfigInternal, 
/** Configure Storage System */
configureStorage: ({ storageKey, dbName, storeName, encryptionKey, hideErrors, }: ConfigParams) => Promise<void>, 
/** Log errors */
showError: () => boolean, 
/** Migrate Data */
migrateSecure: ({ storedKeys, newEncryptionKey, newDbName, newStoreName, }: MigrationParams) => Promise<void>;
export { configureStorage, config, showError, migrateSecure, };
