import { StorageParams } from "./types";
declare const 
/** Save Secure Data (uses IndexedDB)*/
saveSecure: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Secure Data (uses IndexedDB)*/
readSecure: <T>(key: string) => Promise<T | undefined>;
export { saveSecure, readSecure, };
