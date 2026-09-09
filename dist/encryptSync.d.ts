declare const 
/** Encrypt data using XOR cipher.
 *
 * Weak obfuscation-only XOR cipher using native crypto randomness and a custom key.
 * In V8/Chromium the ~512 MB string cap limits a single value near ~400 MB.
 *
 * - No hard size limit.
 * - Tested up to ~400 MB.
 * - Synchronous, blocks UI.
 * - Prefix + base64 output.
 * - Capped by string length. */
encryptDataSync: <T>(data: T, enKey: string) => string | undefined, 
/** Decrypt data using XOR cipher.
 *
 * Weak obfuscation-only XOR decipher for prefixed base64 ciphertext.
 *
 * - Same limits as encryption.
 * - Strips stored prefix. */
decryptDataSync: <T>(encrypted: string, enKey: string) => T | undefined, 
/** Encrypt data using configured key.
 *
 * XOR-encrypts with the configured `encryptionKeyStr`, or plain JSON without one.
 *
 * - Same limits as `encryptDataSync`.
 * - Plain JSON when no key. */
encryptSync: <T>(data: T) => string | undefined, 
/** Decrypt data using configured key.
 *
 * XOR-decrypts with the configured `encryptionKeyStr`, or plain JSON-parses without one.
 *
 * - Same limits as `decryptDataSync`.
 * - Plain JSON when no key. */
decryptSync: <T>(encrypted: string) => T | undefined;
export { encryptDataSync, decryptDataSync, encryptSync, decryptSync, };
