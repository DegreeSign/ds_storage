import { StorageParams } from "./types";
declare const 
/** Save secure data to IndexedDB.
 *
 * AES-GCM encrypts data to base64 and stores it as one IndexedDB record.
 *
 * - Quota up to ~1 GB.
 * - Base64 adds ~33% overhead.
 * - Buffers held in memory. */
saveSecure: <T>({ key, data }: StorageParams<T>) => Promise<boolean>, 
/** Read secure data from IndexedDB.
 *
 * Reads and decrypts an AES-GCM record saved by `saveSecure`.
 *
 * - Quota up to ~1 GB. */
readSecure: <T>(key: string) => Promise<T | undefined>, 
/** Save secure data to localStorage.
 *
 * XOR-encrypts data synchronously to a prefixed base64 string for localStorage.
 *
 * - Quota up to 10 MB.
 * - Base64 adds ~33% overhead.
 * - Synchronous, blocks UI. */
saveSecureSync: <T>({ key, data }: StorageParams<T>) => boolean, 
/** Read secure data from localStorage.
 *
 * Reads and decrypts a prefixed XOR/base64 entry saved by `saveSecureSync`.
 *
 * - Quota up to 10 MB. */
readSecureSync: <T>(key: string) => T | undefined;
export { saveSecure, readSecure, saveSecureSync, readSecureSync, };
