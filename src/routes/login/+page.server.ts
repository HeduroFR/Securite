import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { signSession } from '$lib/server/session';
import { createLimiter } from '$lib/server/ratelimit';
import type { Actions } from './$types';

const limiter = createLimiter({ max: 5, windowMs: 5 * 60_000 });
const COOKIE = 'session';

export const actions: Actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const ip = getClientAddress();
    if (!limiter.check(ip, Date.now())) {
      return fail(429, { error: 'Trop de tentatives. Réessaie plus tard.' });
    }
    const data = await request.formData();
    const passcode = String(data.get('passcode') ?? '');
    if (passcode !== env.SITE_PASSCODE) {
      return fail(401, { error: 'Code incorrect.' });
    }
    const token = signSession(env.SESSION_SECRET, Date.now());
    cookies.set(COOKIE, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60
    });
    throw redirect(303, '/');
  }
};
