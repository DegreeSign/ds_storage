import { StorageParams } from "./types";
declare const 
/** Save Large Data (uses IndexedDB)*/
saveLarge: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read Large Data (uses IndexedDB)*/
readLarge: <T>(key: string) => Promise<T | undefined>;
export { saveLarge, readLarge, };
