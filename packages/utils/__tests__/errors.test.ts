import { describe, it, expect } from "vitest";
import { isApiError, formatErrorMessage } from "../src/errors";

describe("isApiError", () => {
  it("returns true for objects with code and message", () => {
    expect(isApiError({ code: "NOT_FOUND", message: "not found" })).toBe(true);
  });

  it("returns false for plain Error", () => {
    expect(isApiError(new Error("oops"))).toBe(false);
  });

  it("returns false for null", () => {
    expect(isApiError(null)).toBe(false);
  });

  it("returns false for a string", () => {
    expect(isApiError("error string")).toBe(false);
  });

  it("returns false for object missing message field", () => {
    expect(isApiError({ code: "X" })).toBe(false);
  });
});

describe("formatErrorMessage", () => {
  it("extracts message from ApiError", () => {
    expect(
      formatErrorMessage({ code: "VALIDATION_ERROR", message: "bad input" }),
    ).toBe("bad input");
  });

  it("extracts message from Error instance", () => {
    expect(formatErrorMessage(new Error("something failed"))).toBe(
      "something failed",
    );
  });

  it("returns the string directly for string errors", () => {
    expect(formatErrorMessage("direct string error")).toBe(
      "direct string error",
    );
  });

  it("returns fallback message for unknown types", () => {
    expect(formatErrorMessage(42)).toBe("An unexpected error occurred");
    expect(formatErrorMessage(undefined)).toBe("An unexpected error occurred");
    expect(formatErrorMessage(null)).toBe("An unexpected error occurred");
  });
});
