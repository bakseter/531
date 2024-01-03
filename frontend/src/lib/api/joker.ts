import { record, number } from 'typescript-json-decoder';
import type { Week, Day, Profile } from '@api/workout';
import { backendUrl } from '@utils/constants';

const JokerAPI = {
    getJoker: async ({
        idToken,
        profile,
        cycle,
        week,
        day,
        num,
    }: {
        idToken: string;
        profile: Profile;
        cycle: number;
        week: Week;
        day: Day;
        num: number;
    }): Promise<true | undefined> => {
        try {
            const { status } = await fetch(
                `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
                {
                    headers: { Authorization: `Bearer ${idToken}` },
                },
            );

            if (status === 200) return true;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    },

    putJoker: async ({
        idToken,
        profile,
        cycle,
        week,
        day,
        num,
    }: {
        idToken: string;
        profile: Profile;
        cycle: number;
        week: Week;
        day: Day;
        num: number;
    }): Promise<void> => {
        try {
            const { status } = await fetch(
                `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
                {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${idToken}` },
                },
            );

            if (status !== 200 && status !== 202) throw new Error('Failed to update joker');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    },

    getJokerAmount: async ({
        idToken,
        profile,
        cycle,
        week,
        day,
    }: {
        idToken: string;
        profile: Profile;
        cycle: number;
        week: Week;
        day: Day;
    }): Promise<number | undefined> => {
        try {
            const response = await fetch(
                `${backendUrl}/joker/count?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
                {
                    headers: { Authorization: `Bearer ${idToken}` },
                },
            );

            if (response.status === 200) {
                const json = await response.json();
                return record({ count: number })(json).count;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    },
};

export default JokerAPI;
