/**
 * Standard API response wrapper used by all endpoints.
 * Ensures consistent response shape regardless of success or failure.
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Structured error returned in API responses.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Paginated response for list endpoints.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
