import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import BaseWeightsAPI, { type BaseWeights } from '@api/base-weights';

interface HookProps {
    baseWeights: BaseWeights | null;
    setBaseWeights: (baseWeights: BaseWeights) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const BaseWeightsContext = createContext<HookProps>({
    baseWeights: null,
    setBaseWeights: async () => {},
    loading: true,
    error: null,
});

const BaseWeightsProvider = ({ children }: { children: ReactNode }) => {
    const [baseWeights, setBaseWeights] = useState<BaseWeights | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchBaseWeights = async () => {
            if (!session?.idToken) return;

            setError(null);
            setLoading(true);

            try {
                const response = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken });
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
    }, [session?.idToken]);

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

    return (
        <BaseWeightsContext.Provider value={{ baseWeights, setBaseWeights: setNewBaseWeights, loading, error }}>
            {children}
        </BaseWeightsContext.Provider>
    );
};

const useBaseWeights = (): HookProps => useContext(BaseWeightsContext);

export default useBaseWeights;
export { BaseWeightsProvider };
