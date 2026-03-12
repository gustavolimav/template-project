import { ValidationError } from "./errors";

/**
 * Parses and validates a JSON request body.
 * Throws ValidationError if the body is missing or not valid JSON.
 */
export async function parseBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    throw new ValidationError("Invalid or missing request body");
  }
}
