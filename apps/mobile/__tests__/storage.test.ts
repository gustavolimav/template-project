import { storage, supabaseStorageAdapter } from "@/lib/storage";

describe("supabaseStorageAdapter", () => {
  beforeEach(() => {
    // Clear all keys between tests using the underlying storage
    storage.delete("test-key");
    storage.delete("auth-token");
  });

  it("setItem stores a value and getItem retrieves it", () => {
    supabaseStorageAdapter.setItem("auth-token", "my-jwt");
    expect(supabaseStorageAdapter.getItem("auth-token")).toBe("my-jwt");
  });

  it("getItem returns null for a missing key", () => {
    expect(supabaseStorageAdapter.getItem("nonexistent")).toBeNull();
  });

  it("removeItem deletes a key", () => {
    supabaseStorageAdapter.setItem("test-key", "value");
    supabaseStorageAdapter.removeItem("test-key");
    expect(supabaseStorageAdapter.getItem("test-key")).toBeNull();
  });

  it("overwrites existing value with setItem", () => {
    supabaseStorageAdapter.setItem("auth-token", "old");
    supabaseStorageAdapter.setItem("auth-token", "new");
    expect(supabaseStorageAdapter.getItem("auth-token")).toBe("new");
  });
});
