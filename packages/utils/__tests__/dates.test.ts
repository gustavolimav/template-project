import { describe, it, expect } from "vitest";
import {
  formatRelativeTime,
  formatShortDate,
  formatFullDateTime,
} from "../src/dates";

describe("formatShortDate", () => {
  it("formats a Date object to short format", () => {
    // Use local date constructor to avoid UTC/local timezone shift
    const d = new Date(2026, 2, 10); // March 10, 2026 local time
    expect(formatShortDate(d)).toBe("Mar 10, 2026");
  });

  it("returns a string for any valid date", () => {
    const d = new Date(2026, 0, 1); // Jan 1, 2026 local time
    const result = formatShortDate(d);
    expect(result).toMatch(/Jan 1, 2026/);
  });
});

describe("formatFullDateTime", () => {
  it("returns a full date-time string containing month and year", () => {
    const d = new Date(2026, 2, 10, 14, 30); // March 10 local
    const result = formatFullDateTime(d);
    expect(result).toMatch(/March/);
    expect(result).toMatch(/2026/);
  });

  it("accepts a Date object", () => {
    const d = new Date(2026, 5, 15, 9, 0); // June 15 local
    const result = formatFullDateTime(d);
    expect(result).toMatch(/June/);
    expect(result).toMatch(/2026/);
  });
});

describe("formatRelativeTime", () => {
  it("returns a relative string for a recent date", () => {
    const recent = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const result = formatRelativeTime(recent);
    expect(result).toMatch(/minute/);
  });

  it("accepts a string date", () => {
    const result = formatRelativeTime(
      new Date(Date.now() - 1000).toISOString(),
    );
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
