import type { decodeType } from 'typescript-json-decoder';
import { number, record, intersection } from 'typescript-json-decoder';
import { type Profile } from '@api/workout';
import { backendUrl, cycles } from '@utils/constants';
import { addToBaseWeights } from '@utils/helpers';

const floatCoerciveDecoder = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number.parseFloat(value);
    throw new Error(`Expected number or string, got ${typeof value}`);
};

const baseWeightsDecoder = record({
    dl: floatCoerciveDecoder,
    bp: floatCoerciveDecoder,
    sq: floatCoerciveDecoder,
    op: floatCoerciveDecoder,
});
type BaseWeights = decodeType<typeof baseWeightsDecoder>;

type CompExercise = keyof BaseWeights;

const comps: Array<CompExercise> = ['dl', 'bp', 'sq', 'op'];

const baseWeightsModifierDecoder = intersection(baseWeightsDecoder, record({ cycle: number }));
type BaseWeightsModifier = decodeType<typeof baseWeightsModifierDecoder>;

const BaseWeightsAPI = {
    getBaseWeights: async ({
        idToken,
        profile,
    }: {
        idToken: string;
        profile: Profile;
    }): Promise<BaseWeights | undefined> => {
        try {
            const response = await fetch(`${backendUrl}/base-weights?profile=${profile}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsDecoder(json);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
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
    }): Promise<void> => {
        try {
            const { status } = await fetch(`${backendUrl}/base-weights?profile=${profile}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
                body: JSON.stringify(baseWeights),
            });

            if (status !== 200 && status !== 202) throw new Error('Failed to update base weights');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
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
    }): Promise<BaseWeightsModifier | undefined> => {
        try {
            const response = await fetch(`${backendUrl}/base-weights/modifier/${cycle}?profile=${profile}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.status === 200) {
                const json = await response.json();
                return baseWeightsModifierDecoder(json);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
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
    }): Promise<void> => {
        try {
            const { status } = await fetch(`${backendUrl}/base-weights/modifier?profile=${profile}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
                body: JSON.stringify(baseWeightsModifier),
            });

            if (status !== 200 && status !== 202) throw new Error('Failed to update base weights modifier');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    },

    getBaseWeightsForCycle: async ({
        idToken,
        profile,
        baseWeights,
        cycle,
    }: {
        idToken: string;
        profile: Profile;
        baseWeights: BaseWeights | undefined;
        cycle: number;
    }): Promise<BaseWeights> => {
        const response = await Promise.all(
            Array.from({ length: cycles.length }, (_, i) => i + 1).map((c) =>
                BaseWeightsAPI.getBaseWeightsModifier({
                    idToken,
                    profile,
                    cycle: c,
                }),
            ),
        );

        const baseWeightsModifiersRaw = response.filter(
            (mod: BaseWeightsModifier | undefined) => mod !== undefined,
        ) as Array<BaseWeightsModifier>;

        const baseWeightsModifiersFilledCycle: Array<BaseWeightsModifier> = [...new Array(cycle).keys()].map(
            (index) =>
                baseWeightsModifiersRaw.find((mod) => mod.cycle === index + 1) ?? {
                    dl: 0,
                    bp: 0,
                    sq: 0,
                    op: 0,
                    cycle: index + 1,
                },
        );

        const modSumToCycle = baseWeightsModifiersFilledCycle.reduce(
            (prev, curr) => ({
                dl: prev.dl + curr.dl,
                bp: prev.bp + curr.bp,
                sq: prev.sq + curr.sq,
                op: prev.op + curr.op,
                cycle,
            }),
            {
                dl: 0,
                bp: 0,
                sq: 0,
                op: 0,
                cycle,
            },
        );

        const modCycleBaseWeightsToCycle = {
            dl: (baseWeights?.dl ?? 0) + 2.5 * modSumToCycle.dl,
            bp: (baseWeights?.bp ?? 0) + 2.5 * modSumToCycle.bp,
            sq: (baseWeights?.sq ?? 0) + 2.5 * modSumToCycle.sq,
            op: (baseWeights?.op ?? 0) + 2.5 * modSumToCycle.op,
        };

        return addToBaseWeights(modCycleBaseWeightsToCycle, cycle);
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
