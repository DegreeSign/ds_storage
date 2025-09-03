# DegreeSign - Web Storage System

[More Info](https://github.com/DegreeSign/ds_storage)

## Node Integration
Install using `yarn add @degreesign/storage` or `npm install @degreesign/storage` 

```typescript
import {
    configureStorage,
} from "@degreesign/storage";

// configure storage system
await configureStorage({
    storageKey: 'newAppData',
    dbName: 'myDatabase',
    storeName: 'users',
    encryptionKey: 'my-secret-key-123'
});

// quick save/read (unencrypted) only suitable for smaller data
const user: UserData = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };
saveData({ key: `userData`, data: user });
const storedUser = readData<UserData>(`userData`);
console.log('Storage data:', storedUser);
saveData({ key: `userData` }); // Removes the key and data

// secure save/read (encrypted) useful for larger data
await saveSecure({ key: `userData`, data: user });
const dbUser = await readSecure<UserData>(`userData`);
console.log('Database data:', dbUser);
await saveSecure({ key: `userData` }); // Removes the key and data
```

## Browser Integration
Use in browsers through CDN
`<script src="https://cdn.jsdelivr.net/npm/@degreesign/storage@1.0.0/dist/browser/degreesign.min.js"></script>`

```typescript
// configure storage system
await stored.configureStorage({
    storageKey: 'newAppData',
    dbName: 'myDatabase',
    storeName: 'users',
    encryptionKey: 'my-secret-key-123'
});

// quick save/read (unencrypted) only suitable for smaller data
const user: UserData = { id: `1`, name: 'Hasn', email: 'hasn@example.com' };
stored.saveData({ key: `userData`, data: user });
const storedUser = stored.readData<UserData>(`userData`);
console.log('Storage data:', storedUser);
stored.saveData({ key: `userData` }); // Removes the key

// secure save/read (encrypted) useful for larger data
await stored.saveSecure({ key: `userData`, data: user });
const dbUser = await stored.readSecure<UserData>(`userData`);
console.log('Database data:', dbUser);
await stored.saveSecure({ key: `userData` }); // Removes the key
```