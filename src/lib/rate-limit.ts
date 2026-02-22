/**
 * Simple in-memory rate limiter for Gemini API calls.
 * Protects against accidental overuse on the free tier (15 RPM / 1M TPM).
 * Resets naturally as timestamps age out of the window.
 */

const requests = new Map<string, number[]>();

/**
 * Check if a user can make another request within the rate limit window.
 * @param userId - Unique identifier for the user
 * @param maxPerMinute - Maximum requests allowed per 60-second window (default: 10)
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(userId: string, maxPerMinute = 10): boolean {
  const now = Date.now();
  const windowMs = 60_000;

  // Get existing timestamps, filter to current window
  const userRequests = (requests.get(userId) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (userRequests.length >= maxPerMinute) {
    // Update with cleaned timestamps even on rejection
    requests.set(userId, userRequests);
    return false;
  }

  userRequests.push(now);
  requests.set(userId, userRequests);
  return true;
}

/**
 * Get remaining requests available for a user in the current window.
 */
export function getRemainingRequests(
  userId: string,
  maxPerMinute = 10
): number {
  const now = Date.now();
  const windowMs = 60_000;
  const userRequests = (requests.get(userId) ?? []).filter(
    (t) => now - t < windowMs
  );
  return Math.max(0, maxPerMinute - userRequests.length);
}
