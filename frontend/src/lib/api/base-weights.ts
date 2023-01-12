import type { decodeType } from 'typescript-json-decoder';
import { number, record } from 'typescript-json-decoder';

const baseWeightsDecoder = record({
    dl: number,
    bp: number,
    sq: number,
    op: number,
});
type BaseWeights = decodeType<typeof baseWeightsDecoder>;

const BaseWeightsAPI = {
    getBaseWeights: async (): Promise<BaseWeights | boolean | null> => {
        try {
            const response = await fetch('/api/base-weights');

            if (response.status === 200) {
                const json = await response.json();

                return baseWeightsDecoder(json);
            }

            if (response.status === 404) return true;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putBaseWeights: async (baseWeights: BaseWeights): Promise<boolean | null> => {
        try {
            const response = await fetch('/api/base-weights', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(baseWeights),
            });

            if (response.status === 200) return true;
            if (response.status === 202) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },
};

export default BaseWeightsAPI;
export { type BaseWeights, baseWeightsDecoder };
