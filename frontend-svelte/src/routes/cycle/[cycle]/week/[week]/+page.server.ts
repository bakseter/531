import type { PageServerLoad, Action } from './$types';
import { error, redirect, fail } from '@sveltejs/kit';
import { safeParseInt, safeParseISODate } from '$lib/utils';
import BaseWeightsAPI from '$lib/server/base-weights';
import WorkoutAPI from '$lib/server/workout';
import { cycles, days } from '$lib/constants';
import { safeWeekDecoder, safeDayDecoder } from '$lib/types';

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

    console.log({ idToken, profile, date, cycle, week, day });

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

const load: PageServerLoad = async ({ locals, params }) => {
  const idToken = (await locals.getSession())?.idToken;
  if (!idToken) throw error(401, 'Unauthorized');

  const profile = 1;

  const cycle = safeParseInt(params.cycle);
  if (!cycle || !cycles.includes(cycle)) throw error(404, 'Cycle not found');

  const week = safeWeekDecoder(safeParseInt(params.week));
  if (!week) throw error(404, 'Week not found');

  const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken, profile });
  if (!baseWeights) throw error(404, 'Base weights not found');

  const dates: Array<Date | undefined> = await Promise.all(
    days.map((day) => WorkoutAPI.getDate({ idToken, profile, cycle, week, day }))
  );

  return { cycle, week, baseWeights, dates };
};

export { load, actions };
