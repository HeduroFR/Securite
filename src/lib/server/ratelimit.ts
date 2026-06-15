interface LimiterOpts { max: number; windowMs: number; }
interface Bucket { count: number; resetAt: number; }

export function createLimiter({ max, windowMs }: LimiterOpts) {
  const buckets = new Map<string, Bucket>();
  return {
    /** Returns true if the attempt is allowed, false if rate-limited. */
    check(ip: string, nowMs: number): boolean {
      const b = buckets.get(ip);
      if (!b || nowMs >= b.resetAt) {
        buckets.set(ip, { count: 1, resetAt: nowMs + windowMs });
        return true;
      }
      if (b.count >= max) return false;
      b.count += 1;
      return true;
    }
  };
}
