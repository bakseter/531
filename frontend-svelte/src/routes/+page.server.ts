import { fail, redirect, type Action } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import BaseWeightsAPI from '$lib/server/base-weights';
import type { PageServerLoad } from './$types';

const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session?.idToken) throw redirect(307, '/auth/signin');

  const baseWeights = await BaseWeightsAPI.getBaseWeights({
    idToken: session.idToken,
    profile: 1
  });

  if (baseWeights) throw redirect(307, '/cycle/1/week/1');
};

const actions: Record<string, Action> = {
  default: async ({ request, locals }) => {
    const session = await locals.getSession();
    if (!session?.idToken) throw redirect(307, '/auth/signin');

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
        idToken: session.idToken,
        profile,
        baseWeights: { dl, bp, sq, op }
      })
    };
  }
};

export { actions, load };
