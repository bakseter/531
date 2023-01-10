import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import BaseWeightsAPI, { type BaseWeights } from '@api/base-weights';

interface HookProps {
    baseWeights: BaseWeights | null;
    setBaseWeights: (baseWeights: BaseWeights) => Promise<void>;
    loading: boolean;
    setLoading: (l: boolean) => void;
    error: string | null;
    setError: (e: string | null) => void;
}

const BaseWeightsContext = createContext<HookProps>({
    baseWeights: null,
    setBaseWeights: async () => {},
    loading: true,
    setLoading: () => {},
    error: null,
    setError: () => {},
});

const BaseWeightsProvider = ({ children }: { children: ReactNode }) => {
    const [baseWeights, setBaseWeights] = useState<BaseWeights | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBaseWeights = async () => {
            try {
                const response = await BaseWeightsAPI.getBaseWeights();

                if (response === null) {
                    setError('could not get base weights');
                    setLoading(false);
                    return;
                }

                setLoading(false);
                setBaseWeights(response);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
                setLoading(false);
            }
        };
        void fetchBaseWeights();
    }, []);

    const setNewBaseWeights = async (newBaseWeights: BaseWeights) => {
        setLoading(true);
        try {
            const response = await BaseWeightsAPI.putBaseWeights(newBaseWeights);

            if (response === null) {
                setError('could not set base weights');
                setLoading(false);
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
        <BaseWeightsContext.Provider
            value={{ baseWeights, setBaseWeights: setNewBaseWeights, loading, setLoading, error, setError }}
        >
            {children}
        </BaseWeightsContext.Provider>
    );
};

const useBaseWeights = (): HookProps => useContext(BaseWeightsContext);

export default useBaseWeights;
export { BaseWeightsProvider };
