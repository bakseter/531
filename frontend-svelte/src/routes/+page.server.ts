import { fail, redirect, type Action } from '@sveltejs/kit';
import { safeParseInt } from '$lib/utils';
import BaseWeightsAPI from '$lib/server/base-weights';

const actions: Record<string, Action> = {
	default: async ({ request, locals }) => {
		const idToken = locals.getSession?.idToken;
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

		return { success: await BaseWeightsAPI.putBaseWeights({ idToken, profile, baseWeights: { dl, bp, sq, op } }) };
	},
}

export { actions };
