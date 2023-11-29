import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import BaseWeightsAPI from '$lib/server/base-weights';
import { cycles } from '$lib/constants';
import { safeWeekDecoder } from '$lib/types';

const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.getSession();
  if (!session?.idToken) throw error(401, 'Unauthorized');

  const profile = 1;

  const cycle = safeParseInt(params.cycle);
  if (!cycle || !cycles.includes(cycle)) throw error(404, 'Cycle not found');

  const week = safeWeekDecoder(safeParseInt(params.week));
  if (!week) throw error(404, 'Week not found');

  const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile });
  if (!baseWeights) throw error(404, 'Base weights not found');

  return { cycle, week, baseWeights };
};

export { load };
