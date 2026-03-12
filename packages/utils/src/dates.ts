import { formatDistanceToNow, format } from "date-fns";

/**
 * Returns a relative time string like "5 minutes ago".
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Returns a short date string like "Mar 10, 2026".
 */
export function formatShortDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

/**
 * Returns a full date-time string like "March 10, 2026 at 2:30 PM".
 */
export function formatFullDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMMM d, yyyy 'at' h:mm a");
}
