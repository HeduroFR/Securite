import { describe, it, expect } from 'vitest';
import { signSession, verifySession } from './session';

const SECRET = 'test-secret-value';

describe('session token', () => {
  it('verifies a freshly signed token', () => {
    const token = signSession(SECRET, 1_000_000);
    expect(verifySession(SECRET, token, 1_000_000)).toBe(true);
  });

  it('rejects a token signed with a different secret', () => {
    const token = signSession('other-secret', 1_000_000);
    expect(verifySession(SECRET, token, 1_000_000)).toBe(false);
  });

  it('rejects a tampered token', () => {
    const token = signSession(SECRET, 1_000_000) + 'x';
    expect(verifySession(SECRET, token, 1_000_000)).toBe(false);
  });

  it('rejects an expired token (older than 7 days)', () => {
    const issued = 1_000_000;
    const token = signSession(SECRET, issued);
    const eightDaysLater = issued + 8 * 24 * 60 * 60 * 1000;
    expect(verifySession(SECRET, token, eightDaysLater)).toBe(false);
  });

  it('accepts a token within the 7 day window', () => {
    const issued = 1_000_000;
    const token = signSession(SECRET, issued);
    const sixDaysLater = issued + 6 * 24 * 60 * 60 * 1000;
    expect(verifySession(SECRET, token, sixDaysLater)).toBe(true);
  });
});
