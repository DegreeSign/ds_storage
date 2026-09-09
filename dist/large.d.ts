import { StorageParams } from "./types";
declare const 
/** Save large data to IndexedDB.
 *
 * Stores a JSON string as one record, subject to the browser's per-origin quota.
 *
 * - No fixed size cap.
 * - Quota up to ~1 GB.
 * - Record held in memory. */
saveLarge: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read large data from IndexedDB.
 *
 * Reads and parses a JSON record saved by `saveLarge`.
 *
 * - Quota up to ~1 GB. */
readLarge: <T>(key: string) => Promise<T | undefined>;
export { saveLarge, readLarge, };
