import { StorageParams } from "./types";
declare const 
/** Save Data (uses localStorage)*/
saveData: <T>({ key, data }: StorageParams<T>) => void, 
/** Read Data (uses localStorage)*/
readData: <T>(key: string) => T | undefined;
export { saveData, readData, };
