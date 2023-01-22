import type { decodeType } from 'typescript-json-decoder';
import { number, record, intersection } from 'typescript-json-decoder';

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
    getBaseWeights: async (idToken: string): Promise<BaseWeights | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsDecoder(json);
            }

            if (response.status === 404) return true;
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
        baseWeights,
    }: {
        idToken: string;
        baseWeights: BaseWeights;
    }): Promise<boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights`, {
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
        cycle,
    }: {
        idToken: string;
        cycle: number;
    }): Promise<BaseWeightsModifier | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights/modifier/${cycle}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsModifierDecoder(json);
            }

            if (response.status === 404) return true;
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
        baseWeightsModifier,
    }: {
        idToken: string;
        baseWeightsModifier: BaseWeightsModifier;
    }): Promise<boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/base-weights/modifier`, {
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
