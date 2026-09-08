interface DBConfig {
    dbName?: string;
    storeName?: string;
    version?: number;
}

interface DBRead {
    key: string,
    dbName: string,
    storeName: string,
}

interface DBSave extends DBRead {
    data: string | undefined,
}

interface MigrationParams {
    storedKeys: string[];
    newEncryptionKey?: string;
    newDbName?: string;
    newStoreName?: string;
}

interface StorageParams<T> {
    key: string;
    data?: T;
}

interface ConfigParams {
    storageKey: string;
    dbName?: string;
    storeName?: string;
    hideErrors?: boolean;
    encryptionKey?: string;
    /** Prefix to tag sync-encrypted values with (default `ds:`) */
    localStoragePrefix?: string;
}

interface ConfigInternal {
    storageKey: string;
    dbName: string;
    storeName: string;
    hideErrors: boolean;
    encryptionKey?: CryptoKey;
    encryptionKeyStr?: string;
    /** Prefix to tag sync-encrypted values with (default `ds:`) */
    localStoragePrefix: string;
}

export {
    DBConfig,
    DBRead,
    DBSave,
    MigrationParams,
    StorageParams,
    ConfigParams,
    ConfigInternal,
}