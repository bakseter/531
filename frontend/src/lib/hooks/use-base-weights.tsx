'use client';

import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import BaseWeightsAPI, { type BaseWeights, type BaseWeightsModifier } from '@api/base-weights';
import { cycles } from '@utils/constants';
import { addToBaseWeights } from '@utils/helpers';
import { useProfile } from '@hooks/use-profile';

interface BaseWeightsForCycle {
    cycle: number;
    baseWeights: BaseWeights;
}

interface HookProps {
    baseWeights: BaseWeights | null;
    setBaseWeights: (baseWeights: BaseWeights) => Promise<void>;
    baseWeightsForCycle: Array<BaseWeightsForCycle> | null;
    setBaseWeightsModifier: (baseWeightsModifier: BaseWeightsModifier) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const BaseWeightsContext = createContext<HookProps>({
    baseWeights: null,
    setBaseWeights: async () => {},
    baseWeightsForCycle: null,
    setBaseWeightsModifier: async () => {},
    loading: true,
    error: null,
});

const BaseWeightsProvider = ({ children }: { children: ReactNode }) => {
    const [baseWeights, setBaseWeights] = useState<BaseWeights | null>(null);
    const [baseWeightsForCycle, setBaseWeightsForCycle] = useState<Array<BaseWeightsForCycle> | null>(null);
    const { profile } = useProfile();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchBaseWeights = async () => {
            if (!session?.idToken) return;

            setError(null);
            setLoading(true);

            try {
                const response = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile });
                setLoading(false);

                if (!response) return;

                setBaseWeights(response);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
                setLoading(false);
            }
        };
        void fetchBaseWeights();
    }, [session, profile]);

    useEffect(() => {
        if (!session?.idToken) return;

        const fetchBaseWeightsModifiers = async () => {
            const response = await Promise.all(
                Array.from({ length: cycles.length }, (_, i) => i + 1).map((cycle) =>
                    BaseWeightsAPI.getBaseWeightsModifier({
                        idToken: session.idToken,
                        profile,
                        cycle,
                    }),
                ),
            );

            const baseWeightsModifiersRaw = response.filter(
                (mod: BaseWeightsModifier | boolean | null) => mod !== true && mod !== false && mod !== null,
            ) as Array<BaseWeightsModifier>;

            const baseWeightsModifiersFilledCycle = (cycle: number): Array<BaseWeightsModifier> =>
                [...new Array(cycle).keys()].map(
                    (index) =>
                        baseWeightsModifiersRaw.find((mod) => mod.cycle === index + 1) ?? {
                            cycle,
                            dl: 0,
                            bp: 0,
                            sq: 0,
                            op: 0,
                        },
                );

            const modSumToCycle = (cycle: number) =>
                baseWeightsModifiersFilledCycle(cycle).reduce(
                    (prev, curr) => ({
                        dl: prev.dl + curr.dl,
                        bp: prev.bp + curr.bp,
                        sq: prev.sq + curr.sq,
                        op: prev.op + curr.op,
                        cycle,
                    }),
                    {
                        dl: baseWeightsModifiersRaw.find((mod) => mod.cycle === 1)?.dl ?? 0,
                        bp: baseWeightsModifiersRaw.find((mod) => mod.cycle === 1)?.bp ?? 0,
                        sq: baseWeightsModifiersRaw.find((mod) => mod.cycle === 1)?.sq ?? 0,
                        op: baseWeightsModifiersRaw.find((mod) => mod.cycle === 1)?.op ?? 0,
                        cycle,
                    },
                );

            const modCycleBaseWeightsToCycle = (cycle: number) => ({
                dl: (baseWeights?.dl ?? 0) + 2.5 * modSumToCycle(cycle).dl,
                bp: (baseWeights?.bp ?? 0) + 2.5 * modSumToCycle(cycle).bp,
                sq: (baseWeights?.sq ?? 0) + 2.5 * modSumToCycle(cycle).sq,
                op: (baseWeights?.op ?? 0) + 2.5 * modSumToCycle(cycle).op,
            });

            const bwCycle = cycles.map((cycle) => ({
                cycle,
                baseWeights: addToBaseWeights(modCycleBaseWeightsToCycle(cycle), cycle),
            }));

            setBaseWeightsForCycle(bwCycle);
        };
        void fetchBaseWeightsModifiers();
    }, [session?.idToken, baseWeights, profile]);

    const setNewBaseWeights = async (newBaseWeights: BaseWeights) => {
        if (!session?.idToken) return;

        setLoading(true);

        try {
            const response = await BaseWeightsAPI.putBaseWeights({
                idToken: session.idToken,
                profile,
                baseWeights: newBaseWeights,
            });

            if (response === null) {
                setError('could not set base weights');
                setLoading(false);
                return;
            }

            if (!response) {
                await signOut();
                return;
            }

            setLoading(false);
            setBaseWeights(newBaseWeights);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setError(JSON.stringify(error));
            setLoading(false);
        }
    };

    const setBaseWeightsModifier = async (baseWeightsModifier: BaseWeightsModifier) => {
        if (!session?.idToken) return;

        setLoading(true);
        setError(null);

        try {
            const result = await BaseWeightsAPI.putBaseWeightsModifier({
                idToken: session.idToken,
                profile,
                baseWeightsModifier,
            });

            setLoading(false);

            if (!result) {
                setError('could not put base weights modifier');
                return;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setError(JSON.stringify(error));
        }
    };

    return (
        <BaseWeightsContext.Provider
            value={{
                baseWeights,
                setBaseWeights: setNewBaseWeights,
                baseWeightsForCycle,
                setBaseWeightsModifier,
                loading,
                error,
            }}
        >
            {children}
        </BaseWeightsContext.Provider>
    );
};

const useBaseWeights = (): HookProps => useContext(BaseWeightsContext);

export { useBaseWeights, BaseWeightsProvider };
