import { config, showError } from "./config";
import { bytesToBase64, base64ToBytes } from "./utils";

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
    encryptDataSync = <T>(data: T, enKey: string): string | undefined => {
        try {
            const
                nonce = crypto.getRandomValues(new Uint8Array(8)),
                plain = new TextEncoder().encode(JSON.stringify(data)),
                cipher = xorCipher(plain, enKey, nonce),
                out = new Uint8Array(nonce.length + plain.length);
            out.set(nonce);
            if (cipher) out.set(cipher, nonce.length);
            return `${config.localStoragePrefix}${bytesToBase64(out)}`;
        } catch (e) {
            if (showError()) console.log(`encryptDataSync failed`, e);
            try { return JSON.stringify(data); } catch (e) { };
        };
    },
    /** Decrypt data using XOR cipher.
     *
     * Weak obfuscation-only XOR decipher for prefixed base64 ciphertext.
     *
     * - Same limits as encryption.
     * - Strips stored prefix. */
    decryptDataSync = <T>(encrypted: string, enKey: string): T | undefined => {
        try {
            const
                all = base64ToBytes(encrypted.startsWith(config.localStoragePrefix) ?
                    encrypted.slice(config.localStoragePrefix.length)
                    : encrypted),
                nonce = all.slice(0, 8),
                bytes = xorCipher(all.slice(8), enKey, nonce);
            return bytes ? JSON.parse(new TextDecoder().decode(bytes)) as T : undefined;
        } catch (e) {
            if (showError()) console.log(`decryptDataSync failed`, e);
        };
    },
    /** Encrypt data using configured key.
     *
     * XOR-encrypts with the configured `encryptionKeyStr`, or plain JSON without one.
     *
     * - Same limits as `encryptDataSync`.
     * - Plain JSON when no key. */
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
    /** Decrypt data using configured key.
     *
     * XOR-decrypts with the configured `encryptionKeyStr`, or plain JSON-parses without one.
     *
     * - Same limits as `decryptDataSync`.
     * - Plain JSON when no key. */
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