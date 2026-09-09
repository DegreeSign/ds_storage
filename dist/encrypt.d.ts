declare const 
/** Crypto Key Processing */
cryptoKey: (enKey: string | undefined) => Promise<CryptoKey | undefined>, 
/** Encrypt data (AES-GCM) using custom key.
 *
 * Serializes data to JSON and AES-GCM encrypts it into a base64 string.
 * In V8/Chromium the ~512 MB string cap limits a single value near ~400 MB.
 *
 * - No hard size limit.
 * - Tested up to ~400 MB.
 * - Returns ~33% larger base64.
 * - Capped by string length. */
encryptData: <T>(data: T, key: CryptoKey) => Promise<string | undefined>, 
/** Decrypt data (AES-GCM) using custom key.
 *
 * Decodes base64 and AES-GCM decrypts ciphertext from `encryptData`.
 *
 * - No hard size limit.
 * - Input decoded in memory. */
decryptData: <T>(encrypted: string, key: CryptoKey) => Promise<T | undefined>, 
/** Encrypt data using configured key.
 *
 * Encrypts with the configured `encryptionKey`, or plain JSON without one.
 *
 * - Same limits as `encryptData`.
 * - Plain JSON when no key. */
encrypt: <T>(data: T) => Promise<string | undefined>, 
/** Decrypt data using configured key.
 *
 * Decrypts with the configured `encryptionKey`, or plain JSON-parses without one.
 *
 * - Same limits as `decryptData`.
 * - Plain JSON when no key. */
decrypt: <T>(encrypted: string) => Promise<T | undefined>;
export { cryptoKey, encryptData, decryptData, encrypt, decrypt, };
