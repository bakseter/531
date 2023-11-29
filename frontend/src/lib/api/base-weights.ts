import type { decodeType } from 'typescript-json-decoder';
import { number, record, intersection } from 'typescript-json-decoder';
import { type Profile } from '@api/workout';

const baseWeightsDecoder = record({
    dl: number,
    bp: number,
    sq: number,
    op: number,
});
type BaseWeights = decodeType<typeof baseWeightsDecoder>;

type CompExercise = keyof BaseWeights;

const comps: Array<CompExercise> = ['dl', 'bp', 'sq', 'op'];

const baseWeightsModifierDecoder = intersection(baseWeightsDecoder, record({ cycle: number }));
type BaseWeightsModifier = decodeType<typeof baseWeightsModifierDecoder>;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

const BaseWeightsAPI = {
    getBaseWeights: async ({
        idToken,
        profile,
    }: {
        idToken: string;
        profile: Profile;
    }): Promise<BaseWeights | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights?profile=${profile}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsDecoder(json);
            }

            if (response.status === 404 || response.status === 204) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putBaseWeights: async ({
        idToken,
        profile,
        baseWeights,
    }: {
        idToken: string;
        profile: Profile;
        baseWeights: BaseWeights;
    }): Promise<boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights?profile=${profile}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
                body: JSON.stringify(baseWeights),
            });

            if (response.ok) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    getBaseWeightsModifier: async ({
        idToken,
        profile,
        cycle,
    }: {
        idToken: string;
        profile: Profile;
        cycle: number;
    }): Promise<BaseWeightsModifier | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights/modifier/${cycle}?profile=${profile}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsModifierDecoder(json);
            }

            if (response.status === 404 || response.status === 204) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putBaseWeightsModifier: async ({
        idToken,
        profile,
        baseWeightsModifier,
    }: {
        idToken: string;
        profile: Profile;
        baseWeightsModifier: BaseWeightsModifier;
    }): Promise<boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights/modifier?profile=${profile}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
                body: JSON.stringify(baseWeightsModifier),
            });

            if (response.ok) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },
};

export default BaseWeightsAPI;
export {
    type CompExercise,
    type BaseWeights,
    baseWeightsDecoder,
    type BaseWeightsModifier,
    baseWeightsModifierDecoder,
    comps,
};
