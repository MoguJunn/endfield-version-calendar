export const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
export const DEFAULT_RATE_LIMIT_MAX = 60;

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getRequesterKey(request) {
  const headers = request?.headers || {};
  const forwarded = headers["x-vercel-forwarded-for"]
    || headers["x-forwarded-for"]
    || headers["x-real-ip"]
    || request?.socket?.remoteAddress
    || "unknown";

  return String(forwarded).split(",")[0].trim().slice(0, 128)
    || "unknown";
}

export function createMemoryRateLimiter({
  windowMs = positiveInteger(
    process.env.CALENDAR_API_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
  ),
  max = positiveInteger(
    process.env.CALENDAR_API_RATE_LIMIT_MAX,
    DEFAULT_RATE_LIMIT_MAX,
  ),
  now = Date.now,
} = {}) {
  const buckets = new Map();

  return {
    windowMs,
    max,
    check(key) {
      const checkedAt = now();
      const bucketKey = String(key || "unknown");
      const existing = buckets.get(bucketKey);
      const bucket = !existing || checkedAt >= existing.resetAt
        ? { count: 0, resetAt: checkedAt + windowMs }
        : existing;

      bucket.count += 1;
      buckets.set(bucketKey, bucket);

      const allowed = bucket.count <= max;
      const remaining = Math.max(0, max - bucket.count);
      const retryAfter = Math.max(
        1,
        Math.ceil((bucket.resetAt - checkedAt) / 1000),
      );

      return {
        allowed,
        limit: max,
        remaining,
        resetAt: bucket.resetAt,
        retryAfter,
      };
    },
  };
}
