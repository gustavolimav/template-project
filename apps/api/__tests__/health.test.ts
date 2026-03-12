import { describe, it, expect, vi } from "vitest";
import { GET } from "../app/api/health/route";

// Mock supabase
vi.mock("../lib/supabase", () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({ error: null })),
      })),
    })),
  })),
}));

describe("GET /api/health", () => {
  it("returns healthy status when database is connected", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("healthy");
    expect(body.data.services.database).toBe("connected");
    expect(body.data.timestamp).toBeDefined();
    expect(body.error).toBeNull();
  });
});
