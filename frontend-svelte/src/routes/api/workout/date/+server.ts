import { error, redirect } from '@sveltejs/kit';
import { cycles } from '$lib/constants';
import { safeParseISODate, safeParseInt } from '$lib/utils';
import { safeWeekDecoder, safeDayDecoder } from '$lib/types';
import { formatISO } from 'date-fns';
import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL, PUBLIC_API_VERSION } from '$env/static/public';

const BACKEND_URL = `${PUBLIC_BACKEND_URL}/${PUBLIC_API_VERSION}`;

const PUT: RequestHandler = async ({ locals, url, request }) => {
  const idToken = (await locals.getSession())?.idToken;
  if (!idToken) redirect(302, '/auth/signin');

  const cycle = safeParseInt(url.searchParams.get('cycle'));
  if (!cycle || !cycles.includes(cycle)) throw error(400, 'Invalid cycle');

  const week = safeWeekDecoder(url.searchParams.get('week'));
  if (!week) throw error(400, 'Invalid week');

  const day = safeDayDecoder(url.searchParams.get('day'));
  if (!day) throw error(400, 'Invalid day');

  const profile = safeParseInt(url.searchParams.get('profile'));
  if (!profile) throw error(400, 'Invalid profile');

  console.log('halla');
  const { date } = await request.json();

  const { status } = await fetch(
    `${BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ date: formatISO(date) })
    }
  );

  if (status !== 200) throw error(status, 'Failed to PUT workout date');

  return new Response(JSON.stringify({ date: safeParseISODate(date) }));
};

const GET: RequestHandler = async ({ url, locals }) => {
  const idToken = (await locals.getSession())?.idToken;
  if (!idToken) redirect(302, '/auth/signin');

  const cycle = safeParseInt(url.searchParams.get('cycle'));
  if (!cycle || !cycles.includes(cycle)) throw error(400, 'Invalid cycle');

  const week = safeWeekDecoder(url.searchParams.get('week'));
  if (!week) throw error(400, 'Invalid week');

  const day = safeDayDecoder(url.searchParams.get('day'));
  if (!day) throw error(400, 'Invalid day');

  const profile = safeParseInt(url.searchParams.get('profile'));
  if (!profile) throw error(400, 'Invalid profile');

  const response = await fetch(
    `${BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
    {
      headers: { Authorization: `Bearer ${idToken}` }
    }
  );

  if (response.status === 200) {
    const { date } = await response.json();
    return new Response(JSON.stringify({ date: safeParseISODate(date) }));
  } else if (response.status < 400) {
    return new Response(null, { status: response.status });
  }

  throw error(response.status, response.statusText);
};

export { PUT, GET };
