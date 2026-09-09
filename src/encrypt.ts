import { config, showError } from "./config";
import { bytesToBase64, base64ToBytes } from "./utils";

const
    /** Crypto Key Processing */
    cryptoKey = async (enKey: string | undefined): Promise<CryptoKey | undefined> => {
        try {
            if (!enKey) return
            const
                keyMaterial = await crypto.subtle.importKey(
                    'raw',
                    new TextEncoder().encode(enKey),
                    'PBKDF2',
                    false,
                    ['deriveKey']
                ),
                keyProcessed = await crypto.subtle.deriveKey(
                    {
                        name: 'PBKDF2',
                        salt: new TextEncoder().encode('salt'),
                        iterations: 100000,
                        hash: 'SHA-256'
                    },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            return keyProcessed
        } catch (e) {
            if (showError()) console.log(`processKey failed`, e);
        };
    },
    /** Encrypt data (AES-GCM) using custom key.
     *
     * Serializes data to JSON and AES-GCM encrypts it into a base64 string.
     * In V8/Chromium the ~512 MB string cap limits a single value near ~400 MB.
     *
     * - No hard size limit.
     * - Tested up to ~400 MB.
     * - Returns ~33% larger base64.
     * - Capped by string length. */
    encryptData = async <T>(data: T, key: CryptoKey): Promise<string | undefined> => {
        try {
            const
                iv = crypto.getRandomValues(new Uint8Array(12)),
                encodedData = new TextEncoder().encode(JSON.stringify(data)),
                encrypted = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    encodedData
                ),
                encryptedArray = new Uint8Array(encrypted),
                result = new Uint8Array(iv.length + encryptedArray.length);
            result.set(iv);
            result.set(encryptedArray, iv.length);
            return bytesToBase64(result);
        } catch (e) {
            if (showError()) console.log(`encryptData failed`, e);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** Decrypt data (AES-GCM) using custom key.
     *
     * Decodes base64 and AES-GCM decrypts ciphertext from `encryptData`.
     *
     * - No hard size limit.
     * - Input decoded in memory. */
    decryptData = async <T>(encrypted: string, key: CryptoKey): Promise<T | undefined> => {
        try {
            const
                encryptedArray = base64ToBytes(encrypted),
                iv = encryptedArray.slice(0, 12),
                data = encryptedArray.slice(12),
                decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    data
                );
            return JSON.parse(new TextDecoder().decode(decrypted)) as T;
        } catch (e) {
            if (showError()) console.log(`decryptData failed`, e);
        };
    },
    /** Encrypt data using configured key.
     *
     * Encrypts with the configured `encryptionKey`, or plain JSON without one.
     *
     * - Same limits as `encryptData`.
     * - Plain JSON when no key. */
    encrypt = async <T>(
        data: T
    ): Promise<string | undefined> => {
        try {
            return config?.encryptionKey ?
                await encryptData(data, config.encryptionKey)
                : JSON.stringify(data);
        } catch (e) {
            if (showError()) console.log(`encrypt failed`, e);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** Decrypt data using configured key.
     *
     * Decrypts with the configured `encryptionKey`, or plain JSON-parses without one.
     *
     * - Same limits as `decryptData`.
     * - Plain JSON when no key. */
    decrypt = async <T>(
        encrypted: string
    ): Promise<T | undefined> => {
        try {
            return config?.encryptionKey ?
                await decryptData(encrypted, config.encryptionKey)
                : JSON.parse(encrypted) as T;
        } catch (e) {
            if (showError()) console.log(`decrypt failed`, e);
        };
    };

export {
    cryptoKey,
    encryptData,
    decryptData,
    encrypt,
    decrypt,
};