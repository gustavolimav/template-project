import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword, validateRequired } from "../src/validation";

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("user@example.com").valid).toBe(true);
    expect(validateEmail("test.user+tag@domain.co").valid).toBe(true);
  });

  it("rejects empty email", () => {
    const result = validateEmail("");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Email is required");
  });

  it("rejects invalid email format", () => {
    const result = validateEmail("not-an-email");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid email format");
  });
});

describe("validatePassword", () => {
  it("accepts strong passwords", () => {
    expect(validatePassword("MyP@ssw0rd").valid).toBe(true);
    expect(validatePassword("StrongPass1").valid).toBe(true);
  });

  it("rejects empty password", () => {
    const result = validatePassword("");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password is required");
  });

  it("rejects short passwords", () => {
    const result = validatePassword("Ab1");
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/at least 8 characters/);
  });

  it("requires uppercase letter", () => {
    const result = validatePassword("lowercase1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Password must contain at least one uppercase letter",
    );
  });

  it("requires lowercase letter", () => {
    const result = validatePassword("UPPERCASE1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Password must contain at least one lowercase letter",
    );
  });

  it("requires a number", () => {
    const result = validatePassword("NoNumbersHere");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Password must contain at least one number",
    );
  });
});

describe("validateRequired", () => {
  it("accepts non-empty values", () => {
    expect(validateRequired("hello", "Name").valid).toBe(true);
  });

  it("rejects empty values", () => {
    const result = validateRequired("", "Name");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required");
  });

  it("rejects whitespace-only values", () => {
    const result = validateRequired("   ", "Name");
    expect(result.valid).toBe(false);
  });
});
