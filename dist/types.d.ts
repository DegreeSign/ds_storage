interface DBConfig {
    dbName?: string;
    storeName?: string;
    version?: number;
}
interface DBRead {
    key: string;
    dbName: string;
    storeName: string;
}
interface DBSave extends DBRead {
    data: string | undefined;
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
    encryptionKey?: string;
}
export { DBConfig, DBRead, DBSave, MigrationParams, StorageParams, ConfigParams, };
