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
    src="https://cdn.jsdelivr.net/npm/@degreesign/storage@1.0.10/dist/browser/degreesign.min.js"
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

## Usage

```typescript
// configure storage system
await configureStorage({
    storageKey: 'app_name',
    dbName: 'database_name',
    storeName: 'dataset_name',
    encryptionKey: 'encryption_key',
    hideErrors: true,
});

// sample data
const 
    key = `sample_key`,
    data: SampleType = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };

/** saveData - unencrypted */
// save 
saveData({ key, data });
// read
const unsecureData = readData<SampleType>(key);
console.log(`unsecureData`, unsecureData);
// clear
saveData({ key });


/** saveSecure - encrypted */
// save
await saveSecure({ key, data });
// read
const secureData = await readSecure<SampleType>(key);
console.log(`secureData`, secureData);
// clear
await saveSecure({ key });


/** saveSecureSync - encrypted */
// save
saveSecureSync({ key, data });
// read
const secureSyncData = readSecureSync<SampleType>(key);
console.log(`secureSyncData`, secureSyncData);
// clear
saveSecureSync({ key });
```