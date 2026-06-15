import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function hmac(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/** payload is the issue timestamp (ms). Token = "<ts>.<sig>". */
export function signSession(secret: string, nowMs: number): string {
  const payload = String(nowMs);
  return `${payload}.${hmac(secret, payload)}`;
}

export function verifySession(secret: string, token: string, nowMs: number): boolean {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(secret, payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  return nowMs - issued <= MAX_AGE_MS && nowMs >= issued;
}
