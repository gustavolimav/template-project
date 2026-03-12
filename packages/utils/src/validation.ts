const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates an email address format.
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("Invalid email format");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates password strength.
 * Requirements: min 8 chars, at least one uppercase, one lowercase, one number.
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
    return { valid: false, errors };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates that a required field is not empty.
 */
export function validateRequired(
  value: string,
  fieldName: string,
): ValidationResult {
  const errors: string[] = [];

  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  }

  return { valid: errors.length === 0, errors };
}
