import type { Profile } from '$lib/types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import {
	type BaseWeights,
	baseWeightsDecoder,
	type BaseWeightsModifier,
	baseWeightsModifierDecoder
} from '$lib/types';

const BaseWeightsAPI = {
	getBaseWeights: async ({
		idToken,
		profile
	}: {
		idToken: string;
		profile: Profile;
	}): Promise<BaseWeights | undefined> => {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights?profile=${profile}`, {
				headers: { Authorization: `Bearer ${idToken}` }
			});

			if (response.status === 200) {
				const json = await response.json();

				return baseWeightsDecoder(json);
			}
		} catch (error) {
			console.error(error);
		}
	},

	putBaseWeights: async ({
		idToken,
		profile,
		baseWeights
	}: {
		idToken: string;
		profile: Profile;
		baseWeights: BaseWeights;
	}): Promise<boolean> => {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights?profile=${profile}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
				body: JSON.stringify(baseWeights)
			});

			return response.ok;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			return false;
		}
	},

	getBaseWeightsModifier: async ({
		idToken,
		profile,
		cycle
	}: {
		idToken: string;
		profile: Profile;
		cycle: number;
	}): Promise<BaseWeightsModifier | undefined> => {
		try {
			const response = await fetch(
				`${PUBLIC_BACKEND_URL}/base-weights/modifier/${cycle}?profile=${profile}`,
				{
					headers: { Authorization: `Bearer ${idToken}` }
				}
			);

			if (response.status === 200) {
				const json = await response.json();

				return baseWeightsModifierDecoder(json);
			}
		} catch (error) {
			console.error(error);
		}
	},

	putBaseWeightsModifier: async ({
		idToken,
		profile,
		baseWeightsModifier
	}: {
		idToken: string;
		profile: Profile;
		baseWeightsModifier: BaseWeightsModifier;
	}): Promise<boolean> => {
		try {
			const response = await fetch(
				`${PUBLIC_BACKEND_URL}/base-weights/modifier?profile=${profile}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
					body: JSON.stringify(baseWeightsModifier)
				}
			);

			return response.ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
};

export default BaseWeightsAPI;
