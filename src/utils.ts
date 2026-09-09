const
    /** Chunked bytes → binary string → base64 (avoids arg-limit RangeError on large arrays) */
    bytesToBase64 = (bytes: Uint8Array): string => {
        let binary = '', chunk = 0x8000, i = 0;
        for (; i < bytes.length; i += chunk)
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        return btoa(binary);
    },
    /** base64 → bytes via index loop (Uint8Array.from on huge strings crashes V8) */
    base64ToBytes = (b64: string): Uint8Array => {
        const binary = atob(b64), bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    };

export {
    bytesToBase64,
    base64ToBytes,
};
