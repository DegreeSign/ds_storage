declare const 
/** Chunked bytes → binary string → base64 (avoids arg-limit RangeError on large arrays) */
bytesToBase64: (bytes: Uint8Array) => string, 
/** base64 → bytes via index loop (Uint8Array.from on huge strings crashes V8) */
base64ToBytes: (b64: string) => Uint8Array;
export { bytesToBase64, base64ToBytes, };
