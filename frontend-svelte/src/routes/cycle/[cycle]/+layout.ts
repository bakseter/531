import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import { cycles } from '$lib/constants';

const load: LayoutLoad = async ({ params }) => {
  const cycle = safeParseInt(params.cycle);
  if (!cycle || !cycles.includes(cycle)) throw error(404, 'Cycle not found');

  return { cycle };
};

export { load };
