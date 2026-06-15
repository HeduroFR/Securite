import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { verifySession } from '$lib/server/session';

const COOKIE = 'session';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE);
  event.locals.authed = !!token && verifySession(env.SESSION_SECRET, token, Date.now());

  const path = event.url.pathname;
  const isPublic = path === '/login' || path.startsWith('/_app') || path.startsWith('/favicon');

  if (!event.locals.authed && !isPublic) {
    throw redirect(303, '/login');
  }
  if (event.locals.authed && path === '/login') {
    throw redirect(303, '/');
  }
  return resolve(event);
};
