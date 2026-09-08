import { StorageParams } from "./types";
declare const 
/** Save Secure Data (IndexedDB) - encrypted */
saveSecure: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Secure Data (IndexedDB) - encrypted */
readSecure: <T>(key: string) => Promise<T | undefined>, 
/** Save Secure Data (localStorage) - encrypted */
saveSecureSync: <T>({ key, data }: StorageParams<T>) => boolean, 
/** Read Secure Data (localStorage) - encrypted */
readSecureSync: <T>(key: string) => T | undefined;
export { saveSecure, readSecure, saveSecureSync, readSecureSync, };
