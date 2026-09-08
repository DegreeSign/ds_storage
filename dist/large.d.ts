import { StorageParams } from "./types";
declare const 
/** Save Large Data (IndexedDB) - unencrypted */
saveLarge: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Large Data (IndexedDB) - unencrypted */
readLarge: <T>(key: string) => Promise<T | undefined>;
export { saveLarge, readLarge, };
