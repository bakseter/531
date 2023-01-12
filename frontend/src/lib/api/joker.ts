import type { decodeType } from 'typescript-json-decoder';
import { record, boolean, array } from 'typescript-json-decoder';
import type { Week, Day } from '@api/workout';

const jokerDecoder = record({
    joker: array(boolean),
});
type Joker = decodeType<typeof jokerDecoder>;

const JokerAPI = {
    getJoker: async (cycle: number, week: Week, day: Day, num: number): Promise<boolean | null> => {
        try {
            const { ok } = await fetch(`/api/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`);

            return ok;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putJoker: async (cycle: number, week: Week, day: Day, num: number): Promise<boolean> => {
        try {
            const { ok } = await fetch(`/api/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`, {
                method: 'PUT',
            });

            return ok;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return false;
        }
    },
};

export default JokerAPI;
export { jokerDecoder, type Joker };
