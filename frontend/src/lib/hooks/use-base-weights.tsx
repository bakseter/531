import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import BaseWeightsAPI, { type BaseWeights, type BaseWeightsModifier } from '@api/base-weights';
import { cycles } from '@utils/constants';
import { addToBaseWeights } from '@utils/helpers';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchBaseWeights = async () => {
            if (!session?.idToken) return;

            setError(null);
            setLoading(true);

            try {
                const response = await BaseWeightsAPI.getBaseWeights(session.idToken);
                setLoading(false);

                if (response === null) {
                    setError('could not get base weights');
                    return;
                }

                if (response === true) return;
                if (response === false) {
                    await signOut();
                    return;
                }

                setBaseWeights(response);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
                setLoading(false);
            }
        };
        void fetchBaseWeights();
    }, [session]);

    useEffect(() => {
        if (!session?.idToken) return;

        const fetchBaseWeightsModifiers = async () => {
            const response = await Promise.all(
                Array.from({ length: cycles.length }, (_, i) => i + 1).map((c) =>
                    BaseWeightsAPI.getBaseWeightsModifier({
                        idToken: session.idToken,
                        cycle: c,
                    }),
                ),
            );

            const baseWeightsModifiers = response.filter(
                (mod: BaseWeightsModifier | boolean | null) => mod !== true && mod !== false && mod !== null,
            ) as Array<BaseWeightsModifier>;

            const modSumToCycle = (cycle: number) =>
                baseWeightsModifiers.slice(1, cycle).reduce(
                    (prev, curr) => ({
                        dl: prev.dl + curr.dl,
                        bp: prev.bp + curr.bp,
                        sq: prev.sq + curr.sq,
                        op: prev.op + curr.op,
                        cycle,
                    }),
                    {
                        dl: baseWeightsModifiers[0]?.dl ?? 0,
                        bp: baseWeightsModifiers[0]?.bp ?? 0,
                        sq: baseWeightsModifiers[0]?.sq ?? 0,
                        op: baseWeightsModifiers[0]?.op ?? 0,
                        cycle,
                    },
                );

            const modCycleBaseWeightsToCycle = (cycle: number) => ({
                dl: (baseWeights?.dl ?? 0) + 2.5 * modSumToCycle(cycle).dl,
                bp: (baseWeights?.bp ?? 0) + 2.5 * modSumToCycle(cycle).bp,
                sq: (baseWeights?.sq ?? 0) + 2.5 * modSumToCycle(cycle).sq,
                op: (baseWeights?.op ?? 0) + 2.5 * modSumToCycle(cycle).op,
            });

            const bwCycle = cycles.map((c) => ({
                cycle: c,
                baseWeights: addToBaseWeights(modCycleBaseWeightsToCycle(c), c),
            }));

            setBaseWeightsForCycle(bwCycle);
        };
        void fetchBaseWeightsModifiers();
    }, [session?.idToken, baseWeights]);

    const setNewBaseWeights = async (newBaseWeights: BaseWeights) => {
        if (!session?.idToken) return;

        setLoading(true);

        try {
            const response = await BaseWeightsAPI.putBaseWeights({
                idToken: session.idToken,
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

export default useBaseWeights;
export { BaseWeightsProvider };
