import { DBConfig, DBRead, DBSave, StorageParams } from "./types";
declare const 
/** Database (IndexedDB) operations */
openDB: ({ dbName, storeName, version }?: DBConfig) => Promise<IDBDatabase>, 
/** Save Database (uses IndexedDB)*/
saveDB: ({ key, data, dbName, storeName, }: DBSave) => Promise<boolean>, 
/** Read Database (uses IndexedDB)*/
readDB: ({ key, dbName, storeName, }: DBRead) => Promise<string | undefined>, 
/** Save Secure Data (uses IndexedDB)*/
saveSecure: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Secure Data (uses IndexedDB)*/
readSecure: <T>(key: string) => Promise<T | undefined>;
export { openDB, saveDB, readDB, saveSecure, readSecure, };
