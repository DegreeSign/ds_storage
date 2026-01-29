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
`<script src="https://cdn.jsdelivr.net/npm/@degreesign/storage@1.0.2/dist/browser/degreesign.min.js"></script>`

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
    encryptionKey: 'encryption_key'
});

// sample data
const 
    key = `sample_key`,
    data: SampleType = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };

/** quick unencrypted, only suitable for smaller data */
// save 
saveData({ key, data });
// read
const unsecureData = readData<SampleType>(key);
console.log(`unsecureData`, unsecureData);
// clear
saveData({ key });


/** secure, useful for larger data */
// save
await saveSecure({ key, data });
// read
const secureData = await readSecure<SampleType>(key);
console.log(`secureData`, secureData);
// clear
await saveSecure({ key });
```