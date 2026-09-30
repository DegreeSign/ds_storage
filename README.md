# DegreeSign Storage

**Typed, zero-dependency storage for browsers and Node — save and read JSON in `localStorage` and `IndexedDB`, optionally encrypted with AES-GCM or a synchronous XOR cipher.**

[![npm version](https://img.shields.io/npm/v/@degreesign/storage)](https://www.npmjs.com/package/@degreesign/storage)
[![npm downloads](https://img.shields.io/npm/dm/@degreesign/storage)](https://www.npmjs.com/package/@degreesign/storage)
[![license](https://img.shields.io/npm/l/@degreesign/storage)](https://github.com/DegreeSign/ds_storage/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Table of Contents

- [Why DegreeSign Storage](#why-degreesign-storage)
- [Install](#install)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Unencrypted Storage (`localStorage`)](#unencrypted-storage-localstorage)
- [Large Unencrypted Storage (`IndexedDB`)](#large-unencrypted-storage-indexeddb)
- [Secure Storage (encrypted)](#secure-storage-encrypted)
- [Encryption Utilities](#encryption-utilities)
- [Migration](#migration)
- [Types](#types)
- [FAQ](#faq)
- [Keywords](#keywords)

## Why DegreeSign Storage

- **One API for every storage layer.** Plain JSON or encrypted, `localStorage` or `IndexedDB`, sync or async — pick the function that matches your needs.
- **Real encryption.** `saveSecure` / `readSecure` use AES-GCM (PBKDF2, SHA-256, 100,000 iterations) via the Web Crypto API.
- **Synchronous option.** `saveSecureSync` / `readSecureSync` work with a fast XOR obfuscation cipher on `localStorage` — no `await`, no key derivation.
- **TypeScript-first.** Generic `readData<T>`, `readLarge<T>`, `readSecure<T>` return your types, with `.d.ts` shipped in the package.
- **Zero dependencies.** Nothing to audit but the small module you import.
- **Works in browsers and Node.** Browser CDN bundle plus a Node build.
- **Built-in migration.** `migrateSecure` re-encrypts and moves data when you rotate keys or rename your database.

## Install

```bash
# npm
npm install @degreesign/storage

# yarn
yarn add @degreesign/storage

# pnpm
pnpm add @degreesign/storage
```

### Browser via CDN

Use the package directly in the browser, no bundler required:

```html
<script src="https://cdn.jsdelivr.net/npm/@degreesign/storage@1.1.5/dist/browser/degreesign.min.js"></script>
```

The build exposes the same API on `window.stored`:

```typescript
const {
    configureStorage,
    saveData,
    readData,
    saveSecure,
    readSecure,
} = window.stored;
```

## Quick Start

```typescript
import {
    configureStorage,
    saveData,
    readData,
    saveSecure,
    readSecure,
} from "@degreesign/storage";

interface SampleType {
    id: string;
    name: string;
    email: string;
}

// Configure once (async also derives the AES-GCM key)
await configureStorage({
    storageKey: "app_name",
    dbName: "database_name",
    storeName: "dataset_name",
    encryptionKey: "encryption_key",
    hideErrors: true,
});

const key = "sample_key";
const data: SampleType = { id: "1", name: "Hasn", email: "hasn@example.com" };

// Unencrypted, in localStorage
saveData({ key, data });
const unsecureData = readData<SampleType>(key);
console.log(unsecureData);

// Encrypted, in IndexedDB
await saveSecure({ key, data });
const secureData = await readSecure<SampleType>(key);
console.log(secureData);
```

## Configuration

Call `configureStorage` (async) or `configureStorageSync` (sync) once at startup. Only `storageKey` is required.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `storageKey` | `string` | `"appData"` | Namespace/app identifier. |
| `dbName` | `string` | `"appDB"` | `IndexedDB` database name. |
| `storeName` | `string` | `"appStorage"` | `IndexedDB` object store name. |
| `encryptionKey` | `string` | `undefined` | Passphrase for encryption. |
| `hideErrors` | `boolean` | `false` | Suppress logged errors. |
| `localStoragePrefix` | `string` | `"ds:"` | Prefix tagging sync-encrypted `localStorage` values. |

```typescript
import { configureStorage, configureStorageSync } from "@degreesign/storage";

// Async: derives an AES-GCM CryptoKey from encryptionKey
await configureStorage({
    storageKey: "app_name",
    encryptionKey: "encryption_key",
    hideErrors: true,
});

// Sync: no key derivation, just stores encryptionKey for the +Sync functions
configureStorageSync({
    storageKey: "app_name",
    encryptionKey: "encryption_key",
    hideErrors: true,
});
```

> Choose `configureStorage` to enable `migrateSecure`, `saveSecure`, `readSecure`, `encryptData`-based helpers, and `cryptoKey`. The `+Sync` functions work with either configuration.

## Unencrypted Storage (`localStorage`)

Plain JSON in `localStorage`. Synchronous. Quota up to ~10 MB per origin.

| Function | Signature | Description |
| --- | --- | --- |
| `saveData` | `<T>({ key, data }: StorageParams<T>) => void` | Saves `data` as JSON under `key`. Omit `data` to remove the entry. |
| `readData` | `<T>(key: string) => T \| undefined` | Reads and parses the JSON value. |

```typescript
import { saveData, readData } from "@degreesign/storage";

saveData({ key: "sample_key", data: { id: "1", name: "Hasn" } });
const value = readData<{ id: string; name: string }>("sample_key");
saveData({ key: "sample_key" }); // clear
```

## Large Unencrypted Storage (`IndexedDB`)

Plain JSON in `IndexedDB`. Asynchronous. Quota up to ~1 GB, browser-dependent.

| Function | Signature | Description |
| --- | --- | --- |
| `saveLarge` | `<T>({ key, data }: StorageParams<T>) => Promise<boolean>` | Saves `data` as one JSON record. Omit `data` to remove it. Resolves `true` on success. |
| `readLarge` | `<T>(key: string) => Promise<T \| undefined>` | Reads and parses the JSON record. |

```typescript
import { saveLarge, readLarge } from "@degreesign/storage";

await saveLarge({ key: "sample_key", data: { id: "1", name: "Hasn" } });
const value = await readLarge<{ id: string; name: string }>("sample_key");
await saveLarge({ key: "sample_key" }); // clear
```

## Secure Storage (encrypted)

Two encrypted backends: AES-GCM in `IndexedDB` (async, strong) and a XOR obfuscation cipher in `localStorage` (sync, fast).

| Function | Signature | Storage | Cipher | Description |
| --- | --- | --- | --- | --- |
| `saveSecure` | `<T>({ key, data }: StorageParams<T>) => Promise<boolean>` | `IndexedDB` | AES-GCM | Encrypts to base64 and saves one record. Omit `data` to remove it. |
| `readSecure` | `<T>(key: string) => Promise<T \| undefined>` | `IndexedDB` | AES-GCM | Reads and decrypts a record saved by `saveSecure`. |
| `saveSecureSync` | `<T>({ key, data }: StorageParams<T>) => boolean` | `localStorage` | XOR | Synchronously encrypts to a prefixed base64 string. Omit `data` to remove it. |
| `readSecureSync` | `<T>(key: string) => T \| undefined` | `localStorage` | XOR | Reads and decrypts an entry saved by `saveSecureSync`. |

```typescript
import { saveSecure, readSecure, saveSecureSync, readSecureSync } from "@degreesign/storage";

// Async AES-GCM in IndexedDB (~1 GB quota)
await saveSecure({ key: "sample_key", data: { id: "1", name: "Hasn" } });
const secureData = await readSecure<{ id: string; name: string }>("sample_key");

// Sync XOR in localStorage (~10 MB quota)
saveSecureSync({ key: "sample_key", data: { id: "1", name: "Hasn" } });
const secureSyncData = readSecureSync<{ id: string; name: string }>("sample_key");
```

> `saveSecureSync` / `readSecureSync` require `configureStorageSync` (or `configureStorage`) to have set `encryptionKey`. AES-GCM adds ~33% base64 overhead; the XOR cipher is obfuscation only and should not protect sensitive data.

## Encryption Utilities

Low-level helpers for direct encryption without the storage wrappers.

| Function | Signature | Description |
| --- | --- | --- |
| `cryptoKey` | `(enKey: string \| undefined) => Promise<CryptoKey \| undefined>` | Derives an AES-GCM `CryptoKey` from a passphrase (PBKDF2, SHA-256, 100,000 iterations). |
| `encryptData` | `<T>(data: T, key: CryptoKey) => Promise<string \| undefined>` | AES-GCM encrypts to a base64 string (IV prepended). |
| `decryptData` | `<T>(encrypted: string, key: CryptoKey) => Promise<T \| undefined>` | AES-GCM decrypts a value from `encryptData`. |
| `encryptDataSync` | `<T>(data: T, enKey: string) => string \| undefined` | XOR encrypts to a prefixed base64 string (nonce prepended). |
| `decryptDataSync` | `<T>(encrypted: string, enKey: string) => T \| undefined` | XOR decrypts a value from `encryptDataSync`. |

```typescript
import { cryptoKey, encryptData, decryptData } from "@degreesign/storage";

const key = await cryptoKey("encryption_key");
if (key) {
    const cipher = await encryptData({ id: "1" }, key);
    const plain = cipher ? await decryptData<{ id: string }>(cipher, key) : undefined;
}
```

## Migration

`migrateSecure` re-encrypts and moves records between databases, stores, or encryption keys. Requires the AES-GCM key to be configured via `configureStorage`.

| Function | Signature | Description |
| --- | --- | --- |
| `migrateSecure` | `(params: MigrationParams) => Promise<void>` | Migrates the given `storedKeys` from the current database/store/key to the new target. |

| `MigrationParams` field | Type | Description |
| --- | --- | --- |
| `storedKeys` | `string[]` | Keys to migrate. |
| `newEncryptionKey` | `string` | New passphrase (defaults to the current key). |
| `newDbName` | `string` | New `IndexedDB` database name. |
| `newStoreName` | `string` | New object store name. |

```typescript
import { configureStorage, migrateSecure } from "@degreesign/storage";

await configureStorage({ storageKey: "app_name", encryptionKey: "old_key" });

await migrateSecure({
    storedKeys: ["sample_key"],
    newEncryptionKey: "new_key",
    newDbName: "new_database",
    newStoreName: "new_store",
});
```

## Types

| Type | Definition |
| --- | --- |
| `StorageParams<T>` | `{ key: string; data?: T }` — used by all save functions. |
| `ConfigParams` | `{ storageKey; dbName?; storeName?; hideErrors?; encryptionKey?; localStoragePrefix? }` — accepted by the configure functions. |

## FAQ

**What is `@degreesign/storage`?**
A small, typed storage library that reads and writes JSON to `localStorage` and `IndexedDB`, with optional AES-GCM or synchronous XOR encryption.

**Is it free?**
Yes. It is open source under the MIT license.

**Does it work in both Node and the browser?**
Yes. The package ships a browser CDN bundle (`window.stored`) and a Node build, plus TypeScript declarations.

**Does it have any dependencies?**
No. There are zero runtime dependencies.

**Is it TypeScript-friendly?**
Yes. Every read function is generic (`readData<T>`, `readSecure<T>`, `readSecureSync<T>`, `readLarge<T>`) and types ship with the package.

**Which frameworks does it support?**
Any framework — React, Vue, Svelte, Angular, vanilla JS, or Node. The API is plain functions with no framework coupling.

**When should I use the `+Sync` functions?**
When you need a synchronous read/write on `localStorage` and do not want key derivation. For stronger protection, use the async AES-GCM `saveSecure` / `readSecure` in `IndexedDB`.

**How much data can I store?**
`localStorage` is capped around ~10 MB per origin; `IndexedDB` scales up to roughly ~1 GB depending on the browser.

## Keywords

storage, localStorage, IndexedDB, encrypted storage, AES-GCM, XOR cipher, secure storage, browser storage, node storage, TypeScript, offline storage, key-value store, zero dependency, DegreeSign
