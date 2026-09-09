import { StorageParams } from "./types";
declare const 
/** Save data unencrypted to localStorage.
 *
 * Stores JSON under a key, sharing the browser's per-origin localStorage quota.
 *
 * - Quota up to 10 MB.
 * - Stored as JSON string. */
saveData: <T>({ key, data }: StorageParams<T>) => void, 
/** Read data unencrypted from localStorage.
 *
 * Reads and parses a JSON value saved by `saveData`.
 *
 * - Quota up to 10 MB. */
readData: <T>(key: string) => T | undefined;
export { saveData, readData, };
