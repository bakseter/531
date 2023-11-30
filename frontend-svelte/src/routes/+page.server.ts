import { fail, redirect, type Action } from '@sveltejs/kit';
import { safeParseISODate, safeParseInt } from '$lib/utils';
import { safeDayDecoder, safeWeekDecoder } from '$lib/types';
import BaseWeightsAPI from '$lib/server/base-weights';
import WorkoutAPI from '$lib/server/workout';
import type { PageServerLoad } from './$types';

const load: PageServerLoad = async (event) => {
  const idToken = (await event.locals.getSession())?.idToken;
  if (!idToken) throw redirect(307, '/auth/signin');

  const profile = 1;

  const baseWeights = await BaseWeightsAPI.getBaseWeights({
    idToken,
    profile
  });

  if (baseWeights) throw redirect(307, '/cycle/1/week/1');
};

const actions: Record<string, Action> = {
  baseWeights: async ({ request, locals }) => {
    const idToken = (await locals.getSession())?.idToken;
    if (!idToken) throw redirect(307, '/auth/signin');

    const data = await request.formData();

    const dl = safeParseInt(data.get('dl'));
    if (!dl) return fail(400, { dl, missing: true });

    const bp = safeParseInt(data.get('bp'));
    if (!bp) return fail(400, { bp, missing: true });

    const sq = safeParseInt(data.get('sq'));
    if (!sq) return fail(400, { sq, missing: true });

    const op = safeParseInt(data.get('op'));
    if (!op) return fail(400, { op, missing: true });

    const profile = 1;

    return {
      success: await BaseWeightsAPI.putBaseWeights({
        idToken,
        profile,
        baseWeights: { dl, bp, sq, op }
      })
    };
  },

  date: async ({ request, locals }) => {
    const idToken = (await locals.getSession())?.idToken;
    if (!idToken) throw redirect(307, '/auth/signin');

    const data = await request.formData();

    const date = safeParseISODate(data.get('date'));
    if (!date) return fail(400, { date, missing: true });

    const cycle = safeParseInt(data.get('cycle'));
    if (!cycle) return fail(400, { cycle, missing: true });

    const week = safeWeekDecoder(data.get('week'));
    if (!week) return fail(400, { week, missing: true });

    const day = safeDayDecoder(data.get('day'));
    if (!day) return fail(400, { day, missing: true });

    const profile = 1;

    return {
      success: await WorkoutAPI.putDate({
        idToken,
        profile,
        date,
        cycle,
        week,
        day
      })
    };
  }
};

export { actions, load };
