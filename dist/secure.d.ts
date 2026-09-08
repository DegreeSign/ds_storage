import { StorageParams } from "./types";
declare const 
/** Save Secure Data (uses IndexedDB)*/
saveSecure: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Secure Data (uses IndexedDB)*/
readSecure: <T>(key: string) => Promise<T | undefined>, 
/** Save Secure Data (uses localStorage)*/
saveSecureSync: <T>({ key, data }: StorageParams<T>) => boolean, 
/** Read Secure Data (uses localStorage)*/
readSecureSync: <T>(key: string) => T | undefined;
export { saveSecure, readSecure, saveSecureSync, readSecureSync, };
