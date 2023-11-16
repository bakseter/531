import { redirect } from '@sveltejs/kit';
import BaseWeightsAPI from '$lib/server/base-weights';
import type { LayoutServerLoad } from './$types';

const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session?.idToken) throw redirect(307, '/auth/signin');

  const baseWeights = await BaseWeightsAPI.getBaseWeights({
    profile: 1,
    idToken: session?.idToken
  });

  if (baseWeights) throw redirect(307, `/week/1/cycle/1`);
};

export { load };
