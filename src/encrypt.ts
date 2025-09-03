import { ENCRYPTION_KEY } from "./config";

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
        } catch (error) {
            console.log(`processKey failed`, error);
        };
    },
    /** AES-GCM data encryption using custom key */
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
            return btoa(String.fromCharCode(...result));
        } catch (error) {
            console.log(`encryptData failed`, error);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** AES-GCM data decryption using custom key */
    decryptData = async <T>(encrypted: string, key: CryptoKey): Promise<T | undefined> => {
        try {
            const
                encryptedArray = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0)),
                iv = encryptedArray.slice(0, 12),
                data = encryptedArray.slice(12),
                decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    data
                );
            return JSON.parse(new TextDecoder().decode(decrypted)) as T;
        } catch (error) {
            console.log(`decryptData failed`, error);
            return;
        };
    },
    /** AES-GCM data encryption using set key */
    encrypt = async <T>(
        data: T
    ): Promise<string | undefined> => {
        try {
            if (!ENCRYPTION_KEY) return JSON.stringify(data);
            return await encryptData(data, ENCRYPTION_KEY);
        } catch (error) {
            console.log(`encrypt failed`, error);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** AES-GCM data decryption using set key */
    decrypt = async <T>(
        encrypted: string
    ): Promise<T | undefined> => {
        try {
            if (!ENCRYPTION_KEY) return JSON.parse(encrypted) as T;
            return await decryptData(encrypted, ENCRYPTION_KEY);
        } catch (error) {
            console.log(`decrypt failed`, error);
            return;
        };
    };

export {
    cryptoKey,
    encryptData,
    decryptData,
    encrypt,
    decrypt,
};