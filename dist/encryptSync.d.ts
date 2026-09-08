declare const 
/** Simple weak XOR cipher using native crypto randomness — obfuscation only. */
encryptDataSync: <T>(data: T, enKey: string) => string | undefined, 
/** Simple weak XOR decipher — obfuscation only. */
decryptDataSync: <T>(encrypted: string, enKey: string) => T | undefined, 
/** XOR data encryption using set key */
encryptSync: <T>(data: T) => string | undefined, 
/** XOR data decryption using set key */
decryptSync: <T>(encrypted: string) => T | undefined;
export { encryptDataSync, decryptDataSync, encryptSync, decryptSync, };
