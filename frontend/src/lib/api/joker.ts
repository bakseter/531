import type { decodeType } from 'typescript-json-decoder';
import { record, boolean, array } from 'typescript-json-decoder';
import type { Week, Day } from '@api/workout';

const jokerDecoder = record({
    joker: array(boolean),
});
type Joker = decodeType<typeof jokerDecoder>;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

const JokerAPI = {
    getJoker: async ({
        idToken,
        cycle,
        week,
        day,
        num,
    }: {
        idToken: string;
        cycle: number;
        week: Week;
        day: Day;
        num: number;
    }): Promise<boolean | null> => {
        try {
            const { ok } = await fetch(`${BACKEND_URL}/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            return ok;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putJoker: async ({
        idToken,
        cycle,
        week,
        day,
        num,
    }: {
        idToken: string;
        cycle: number;
        week: Week;
        day: Day;
        num: number;
    }): Promise<boolean> => {
        try {
            const { ok } = await fetch(`${BACKEND_URL}/joker/${num}?cycle=${cycle}&week=${week}&day=${day}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${idToken}` },
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
