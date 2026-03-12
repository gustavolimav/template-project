/**
 * Jest mock for react-native-mmkv.
 * Provides an in-memory Map-based implementation for testing.
 */
const store = new Map<string, string>();

export class MMKV {
  set(key: string, value: string | number | boolean): void {
    store.set(key, String(value));
  }

  getString(key: string): string | undefined {
    return store.get(key);
  }

  getNumber(key: string): number | undefined {
    const val = store.get(key);
    return val !== undefined ? Number(val) : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const val = store.get(key);
    return val !== undefined ? val === "true" : undefined;
  }

  delete(key: string): void {
    store.delete(key);
  }

  contains(key: string): boolean {
    return store.has(key);
  }

  getAllKeys(): string[] {
    return Array.from(store.keys());
  }

  clearAll(): void {
    store.clear();
  }
}
