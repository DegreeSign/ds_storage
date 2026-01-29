import { StorageParams } from "./types";

const
    /** Save Data (uses localStorage)*/
    saveData = <T>({ key, data }: StorageParams<T>): void => {
        try {
            if (data === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.log(`saveData failed`, e);
        };
    },
    /** Read Data (uses localStorage)*/
    readData = <T>(key: string): T | undefined => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : undefined;
        } catch (e) {
            console.log(`readData failed`, e);
        };
    };

export {
    saveData,
    readData,
};