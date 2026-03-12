import { MMKV } from "react-native-mmkv";

/**
 * MMKV storage instance for fast, synchronous key-value storage.
 * Used for auth tokens and app preferences.
 *
 * Requires New Architecture (TurboModules) — use `expo run:ios` for a dev build.
 * Falls back to an in-memory Map in Expo Go / test environments.
 *
 * In test environments, the Jest mock (__mocks__/react-native-mmkv.ts)
 * provides an in-memory Map-based implementation.
 */

type StorageInstance = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

function createStorage(): StorageInstance {
  try {
    return new MMKV({ id: "app-template-storage" });
  } catch {
    // Expo Go / environments without New Architecture — use in-memory fallback
    const map = new Map<string, string>();
    return {
      getString: (key) => map.get(key),
      set: (key, value) => { map.set(key, value); },
      delete: (key) => { map.delete(key); },
    };
  }
}

export const storage = createStorage();

/**
 * Supabase-compatible storage adapter.
 * Implements the interface expected by @supabase/supabase-js for session persistence.
 */
export const supabaseStorageAdapter = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};
