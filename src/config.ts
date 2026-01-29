import { readDB, saveDB } from "./db";
import { cryptoKey, decryptData, encryptData } from "./encrypt";
import { ConfigParams, MigrationParams } from "./types";

let
    STORAGE_KEY = 'appData',
    DB_NAME = 'appDB',
    STORE_NAME = 'appStorage',
    ENCRYPTION_KEY: CryptoKey | undefined,
    HIDE_ERRORS = false;

const
    CONFIG_STORAGE_KEY = `appConfig`,
    /** Initialize configurable variables from localStorage on start */
    initialiseConfig = async () => {
        try {
            const configData = localStorage.getItem(CONFIG_STORAGE_KEY);
            if (configData) {
                const config = JSON.parse(configData) as ConfigParams;
                STORAGE_KEY = config.storageKey;
                DB_NAME = config.dbName || DB_NAME;
                STORE_NAME = config.storeName || STORE_NAME;
                ENCRYPTION_KEY = config.encryptionKey ? await cryptoKey(config.encryptionKey)
                    : undefined;
                HIDE_ERRORS = config.hideErrors ?? HIDE_ERRORS;
            };
        } catch (e) {
            console.log(`initialiseConfig failed`, e);
        };
    },
    /** Configure Storage System */
    configureStorage = async ({
        storageKey,
        dbName,
        storeName,
        encryptionKey
    }: ConfigParams): Promise<void> => {
        try {

            // Initialize configuration on start
            await initialiseConfig();

            // Check if any configuration has changed
            const prevConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
            let prevConfigParsed: ConfigParams | undefined;
            if (prevConfig)
                prevConfigParsed = JSON.parse(prevConfig) as ConfigParams;

            // Store new configuration
            const config: ConfigParams = {
                storageKey,
                dbName: dbName || DB_NAME,
                storeName: storeName || STORE_NAME,
                encryptionKey
            };
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));

            // Update variables
            STORAGE_KEY = storageKey;
            if (config.dbName) DB_NAME = config.dbName;
            if (config.storeName) STORE_NAME = config.storeName;

            // Set or update encryption key
            ENCRYPTION_KEY = encryptionKey ? await cryptoKey(encryptionKey)
                : undefined;
        } catch (e) {
            console.log(`configureStorage failed`, e);
        };
    },
    /** Get Configuration */
    getConfig = () => {
        return {
            storageKey: STORAGE_KEY,
            dbName: DB_NAME,
            storeName: STORE_NAME,
            ENCRYPTION_KEY,
            hideErrors: HIDE_ERRORS,
        }
    },
    /** Migrate Data */
    migrateSecure = async ({
        storedKeys,
        newEncryptionKey,
        newDbName,
        newStoreName,
    }: MigrationParams): Promise<void> => {

        console.log(`Data migration started...`);

        // record old keys
        const
            oldKey = ENCRYPTION_KEY,
            oldDbName = DB_NAME,
            oldStoreName = STORE_NAME;

        // update new keys
        ENCRYPTION_KEY = await cryptoKey(newEncryptionKey) ?? ENCRYPTION_KEY;
        DB_NAME = newDbName ?? DB_NAME;
        STORE_NAME = newStoreName ?? STORE_NAME;

        // migrate storedKeys
        for (let i = 0; i < storedKeys.length; i++) {
            const key = storedKeys[i];
            try {
                const
                    raw = await readDB({
                        key,
                        dbName: oldDbName,
                        storeName: oldStoreName
                    }),
                    decrypted = raw ?
                        oldKey ? await decryptData(raw, oldKey)
                            : JSON.parse(raw)
                        : undefined,
                    encrypted = decrypted ?
                        ENCRYPTION_KEY ?
                            await encryptData(decrypted, ENCRYPTION_KEY)
                            : JSON.stringify(decrypted)
                        : undefined;
                if (encrypted) // only save if data available
                    await saveDB({
                        key,
                        data: encrypted,
                        dbName: DB_NAME,
                        storeName: STORE_NAME
                    });
            } catch (e) {
                console.log(`migrateSecure failed`, key, e);
            };
        };

        console.log(`Data migration finished!`);
    };

export {
    configureStorage,
    getConfig,
    migrateSecure,
};