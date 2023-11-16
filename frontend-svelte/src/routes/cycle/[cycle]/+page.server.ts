import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import { cycles } from '$lib/constants';

const load: PageServerLoad = async ({ params }) => {
  const cycle = safeParseInt(params.cycle);

  if (cycle && cycles.includes(cycle)) return { cycle };

  throw error(404, 'Cycle not found');
};

export { load };
