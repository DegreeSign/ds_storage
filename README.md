# DegreeSign - Web Storage System

[More Info](https://github.com/DegreeSign/ds_storage)

## Node Integration
Install using `yarn add @degreesign/storage` or `npm install @degreesign/storage` 

```typescript
import {
    configureStorage,
    saveData,
    readData,
    saveSecure,
    readSecure,
} from "@degreesign/storage";
```

## Browser Integration
Use in browsers through CDN
```html
<script 
    src="https://cdn.jsdelivr.net/npm/@degreesign/storage@1.1.4/dist/browser/degreesign.min.js"
></script>
```

```typescript
const {
    configureStorage,
    saveData,
    readData,
    saveSecure,
    readSecure,
} = window.stored;
```

## Sync Usage

Configure the storage system with `configureStorageSync` (sync — sets `encryptionKeyStr` only, no key derivation):

```typescript
configureStorageSync({
    storageKey: 'app_name',
    encryptionKey: 'encryption_key',
    hideErrors: true,
});
```

```typescript
// sample data
const
    key = `sample_key`,
    data: SampleType = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };

/** saveData - unencrypted (localStorage). Limit: up to ~10 MB per origin. */
// save
saveData({ key, data });
// read
const unsecureData = readData<SampleType>(key);
console.log(`unsecureData`, unsecureData);
// clear
saveData({ key });

/** saveSecureSync - encrypted (localStorage). Limit: up to ~10 MB per origin. */
// save
saveSecureSync({ key, data });
// read
const secureSyncData = readSecureSync<SampleType>(key);
console.log(`secureSyncData`, secureSyncData);
// clear
saveSecureSync({ key });
```

## Async Usage

Configure the storage system with `configureStorage` (async — derives an AES-GCM `CryptoKey` from `encryptionKey`). This enables the additional async functionality below:

```typescript
await configureStorage({
    storageKey: 'app_name',
    dbName: 'database_name',
    storeName: 'dataset_name',
    encryptionKey: 'encryption_key',
    hideErrors: true,
});
```

```typescript
// sample data
const
    key = `sample_key`,
    data: SampleType = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };

/** saveSecure - encrypted (IndexedDB). Limit: up to ~1 GB (browser-dependent). */
// save
await saveSecure({ key, data });
// read
const secureData = await readSecure<SampleType>(key);
console.log(`secureData`, secureData);
// clear
await saveSecure({ key });
```

> Note: `configureStorage` enables `migrateSecure`, `encrypt`, `decrypt`, `saveSecure`, and `readSecure`. The `+Sync` functions work in both configurations.