import { readDB, saveDB } from "./db";
import { cryptoKey, decryptData, encryptData } from "./encrypt";
import { ConfigInternal, ConfigParams, MigrationParams } from "./types";

const
    /** Storage System Configuration */
    config: ConfigInternal = {
        storageKey: `appData`,
        dbName: `appDB`,
        storeName: `appStorage`,
        encryptionKey: undefined,
        hideErrors: false,
    },
    /** Configure Storage System */
    configureStorage = async ({
        storageKey,
        dbName,
        storeName,
        encryptionKey,
        hideErrors,
    }: ConfigParams): Promise<void> => {
        try {
            if (storageKey) config.storageKey = storageKey;
            if (dbName) config.dbName = dbName;
            if (storeName) config.storeName = storeName;
            if (encryptionKey) {
                config.encryptionKey = await cryptoKey(encryptionKey);
                config.encryptionKeyStr = encryptionKey;
            };
            if (hideErrors != undefined) config.hideErrors = hideErrors;
        } catch (e) {
            if (showError()) console.log(`configureStorage failed`, e);
        };
    },
    /** Log errors */
    showError = () => !config.hideErrors,
    /** Migrate Data */
    migrateSecure = async ({
        storedKeys,
        newEncryptionKey,
        newDbName,
        newStoreName,
    }: MigrationParams): Promise<void> => {

        if (showError()) console.log(`Data migration started...`);

        // record old keys
        const
            oldKey = config.encryptionKey,
            oldDbName = config.dbName,
            oldStoreName = config.storeName;

        // update new keys
        config.encryptionKey = await cryptoKey(newEncryptionKey) ?? config.encryptionKey;
        config.encryptionKeyStr = newEncryptionKey ?? config.encryptionKeyStr;
        config.dbName = newDbName ?? config.dbName;
        config.storeName = newStoreName ?? config.storeName;

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
                        config.encryptionKey ?
                            await encryptData(decrypted, config.encryptionKey)
                            : JSON.stringify(decrypted)
                        : undefined;
                if (encrypted) // only save if data available
                    await saveDB({
                        key,
                        data: encrypted,
                        dbName: config.dbName,
                        storeName: config.storeName
                    });
            } catch (e) {
                if (showError()) console.log(`migrateSecure failed`, key, e);
            };
        };

        if (showError()) console.log(`Data migration finished!`);
    };

export {
    configureStorage,
    config,
    showError,
    migrateSecure,
};