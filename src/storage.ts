import { StorageParams } from "./types";

const
    /** Save Data (uses localStorage)*/
    saveData = <T>({ key, data }: StorageParams<T>): void => {
        try {
            if (data === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.log(`saveData failed`, error);
        };
    },
    /** Read Data (uses localStorage)*/
    readData = <T>(key: string): T | undefined => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : undefined;
        } catch (error) {
            console.log(`readData failed`, error);
            return;
        };
    };

export {
    saveData,
    readData,
};