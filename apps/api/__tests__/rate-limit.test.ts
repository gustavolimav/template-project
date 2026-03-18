import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows the first request", () => {
    const result = rateLimit(`test-${Date.now()}`, 5);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("counts requests within the window", () => {
    const id = `counter-${Date.now()}`;
    rateLimit(id, 3);
    rateLimit(id, 3);
    const third = rateLimit(id, 3);
    expect(third.success).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const id = `block-${Date.now()}`;
    rateLimit(id, 2);
    rateLimit(id, 2);
    const third = rateLimit(id, 2);
    expect(third.success).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("returns a resetAt timestamp in the future", () => {
    const id = `reset-${Date.now()}`;
    const result = rateLimit(id, 10, 60_000);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });

  it("resets the counter after the window expires", () => {
    const id = `window-${Date.now()}`;
    // Use a 1 ms window so it expires immediately
    rateLimit(id, 1, 1);
    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = rateLimit(id, 1, 60_000);
        expect(result.success).toBe(true);
        resolve();
      }, 10);
    });
  });
});
