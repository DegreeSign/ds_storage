declare const 
/** Crypto Key Processing */
cryptoKey: (enKey: string | undefined) => Promise<CryptoKey | undefined>, 
/** AES-GCM data encryption using custom key */
encryptData: <T>(data: T, key: CryptoKey) => Promise<string | undefined>, 
/** AES-GCM data decryption using custom key */
decryptData: <T>(encrypted: string, key: CryptoKey) => Promise<T | undefined>, 
/** AES-GCM data encryption using set key */
encrypt: <T>(data: T) => Promise<string | undefined>, 
/** AES-GCM data decryption using set key */
decrypt: <T>(encrypted: string) => Promise<T | undefined>;
export { cryptoKey, encryptData, decryptData, encrypt, decrypt, };
