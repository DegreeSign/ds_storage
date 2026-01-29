import { DBConfig, DBRead, DBSave } from "./types";
declare const 
/** Database (IndexedDB) operations */
openDB: ({ dbName, storeName, version }?: DBConfig) => Promise<IDBDatabase>, 
/** Save Database (uses IndexedDB)*/
saveDB: ({ key, data, dbName, storeName, }: DBSave) => Promise<boolean>, 
/** Read Database (uses IndexedDB)*/
readDB: ({ key, dbName, storeName, }: DBRead) => Promise<string | undefined>;
export { openDB, saveDB, readDB, };
