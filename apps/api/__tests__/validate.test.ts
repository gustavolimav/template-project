import { describe, it, expect } from "vitest";
import { parseBody } from "@/lib/validate";

describe("parseBody", () => {
  it("parses valid JSON body", async () => {
    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Alice", age: 30 }),
    });
    const body = await parseBody<{ name: string; age: number }>(req);
    expect(body.name).toBe("Alice");
    expect(body.age).toBe(30);
  });

  it("throws ValidationError for invalid JSON", async () => {
    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json{",
    });
    const { ValidationError } = await import("@/lib/errors");
    await expect(parseBody(req)).rejects.toThrow(ValidationError);
    await expect(
      parseBody(
        new Request("http://localhost/test", {
          method: "POST",
          body: "bad",
        }),
      ),
    ).rejects.toThrow("Invalid or missing request body");
  });
});
