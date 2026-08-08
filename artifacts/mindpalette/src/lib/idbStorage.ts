/**
 * Tiny IndexedDB key-value storage for zustand's persist middleware.
 * localStorage caps out around 5MB, which base64 AI images blow past
 * quickly — IndexedDB can hold hundreds of MB.
 */
import type { StateStorage } from "zustand/middleware";

const DB_NAME = "imagineme-db";
const STORE = "keyval";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

export const idbStorage: StateStorage = {
  getItem: async (name) => {
    // One-time migration: pull any old localStorage state into IndexedDB
    // so existing stories/points/settings aren't lost.
    const existing = await withStore<string | undefined>("readonly", (s) => s.get(name) as IDBRequest<string | undefined>);
    if (existing != null) return existing;

    try {
      const legacy = localStorage.getItem(name);
      if (legacy != null) {
        await withStore("readwrite", (s) => s.put(legacy, name));
        localStorage.removeItem(name);
        return legacy;
      }
    } catch {
      // localStorage unavailable or corrupt — start fresh
    }
    return null;
  },
  setItem: async (name, value) => {
    await withStore("readwrite", (s) => s.put(value, name));
  },
  removeItem: async (name) => {
    await withStore("readwrite", (s) => s.delete(name));
  },
};
