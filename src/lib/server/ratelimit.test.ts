import { describe, it, expect } from 'vitest';
import { createLimiter } from './ratelimit';

describe('login rate limiter', () => {
  it('allows up to the limit then blocks', () => {
    const limiter = createLimiter({ max: 3, windowMs: 60_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 1)).toBe(true);
    expect(limiter.check('1.1.1.1', 2)).toBe(true);
    expect(limiter.check('1.1.1.1', 3)).toBe(false);
  });

  it('tracks IPs independently', () => {
    const limiter = createLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('2.2.2.2', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 1)).toBe(false);
  });

  it('resets after the window passes', () => {
    const limiter = createLimiter({ max: 1, windowMs: 1_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 500)).toBe(false);
    expect(limiter.check('1.1.1.1', 1_001)).toBe(true);
  });
});
