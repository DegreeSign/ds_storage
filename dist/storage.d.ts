import { StorageParams } from "./types";
declare const 
/** Save Data (localStorage) - unencrypted */
saveData: <T>({ key, data }: StorageParams<T>) => void, 
/** Read Data (localStorage) - unencrypted */
readData: <T>(key: string) => T | undefined;
export { saveData, readData, };
