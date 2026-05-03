import { toast } from "sonner";

/**
 * Global API error handler.
 * Extracts the most useful error message from an RTK Query error
 * and displays it via a Sonner toast notification.
 *
 * @param {unknown} error - The caught error object
 * @param {string} [fallback="An unexpected error occurred."] - Fallback message
 */
export function handleApiError(
  error,
  fallback = "An unexpected error occurred.",
) {
  // RTK Query wraps server errors in error.data
  const serverMessage =
    error?.data?.message || error?.data?.error || error?.message;

  // Server message can sometimes be an array (class-validator)
  const message = Array.isArray(serverMessage)
    ? serverMessage.join(", ")
    : serverMessage || fallback;

  toast.error(message);
}
