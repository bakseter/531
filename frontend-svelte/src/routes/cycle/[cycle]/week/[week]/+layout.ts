import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import { cycles } from '$lib/constants';
import { safeWeekDecoder } from '$lib/types';

const load: LayoutLoad = async ({ params }) => {
  const cycle = safeParseInt(params.cycle);
  if (!cycle || !cycles.includes(cycle)) throw error(404, 'Cycle not found');

  const week = safeWeekDecoder(params.week);
  if (!week) throw error(404, 'Week not found: layout');

  return { cycle, week };
};

export { load };
