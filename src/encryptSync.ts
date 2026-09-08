import { config, showError } from "./config";

const
    /** Shared XOR en/decode (key + nonce keystream) — obfuscation only. */
    xorCipher = (bytes: Uint8Array, enKey: string, nonce: Uint8Array): Uint8Array | undefined => {
        try {
            const out = new Uint8Array(bytes.length);
            for (let i = 0; i < bytes.length; i++)
                out[i] = bytes[i] ^ (enKey.charCodeAt(i % enKey.length) & 0xff) ^ nonce[i % nonce.length];
            return out;
        } catch (e) {
            if (showError()) console.log(`xorCipher failed`, e);
        };
    },
    /** Simple weak XOR cipher using native crypto randomness — obfuscation only. */
    encryptDataSync = <T>(data: T, enKey: string): string | undefined => {
        try {
            const
                nonce = crypto.getRandomValues(new Uint8Array(8)),
                plain = new TextEncoder().encode(JSON.stringify(data)),
                cipher = xorCipher(plain, enKey, nonce),
                out = new Uint8Array(nonce.length + plain.length);
            out.set(nonce);
            if (cipher) out.set(cipher, nonce.length);
            return `${config.scPrefix}${btoa(String.fromCharCode(...out))}`;
        } catch (e) {
            if (showError()) console.log(`encryptDataSync failed`, e);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** Simple weak XOR decipher — obfuscation only. */
    decryptDataSync = <T>(encrypted: string, enKey: string): T | undefined => {
        try {
            const
                all = Uint8Array.from(atob(encrypted.startsWith(config.scPrefix) ?
                    encrypted.slice(config.scPrefix.length)
                    : encrypted), c => c.charCodeAt(0)),
                nonce = all.slice(0, 8),
                bytes = xorCipher(all.slice(8), enKey, nonce);
            return bytes ? JSON.parse(new TextDecoder().decode(bytes)) as T : undefined;
        } catch (e) {
            if (showError()) console.log(`decryptDataSync failed`, e);
        };
    },
    /** XOR data encryption using set key */
    encryptSync = <T>(data: T): string | undefined => {
        try {
            return config?.encryptionKeyStr ?
                encryptDataSync(data, config.encryptionKeyStr)
                : JSON.stringify(data);
        } catch (e) {
            if (showError()) console.log(`encryptSync failed`, e);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** XOR data decryption using set key */
    decryptSync = <T>(encrypted: string): T | undefined => {
        try {
            return config?.encryptionKeyStr ?
                decryptDataSync(encrypted, config.encryptionKeyStr)
                : JSON.parse(encrypted) as T;
        } catch (e) {
            if (showError()) console.log(`decryptSync failed`, e);
        };
    };

export {
    encryptDataSync,
    decryptDataSync,
    encryptSync,
    decryptSync,
};