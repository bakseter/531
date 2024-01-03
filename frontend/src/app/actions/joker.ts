'use server';

import { type Week, type Day } from '@api/workout';
import { auth } from '@api/auth-config';
import { backendUrl } from '@utils/constants';

const setJoker = async (cycle: number, week: Week, day: Day, num: number): Promise<void> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const profile = 1;

    const { status } = await fetch(
        `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            method: 'PUT',
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (status !== 200 && status !== 202) throw new Error('Failed to update joker');
};

const getJoker = async (cycle: number, week: Week, day: Day, num: number): Promise<true | undefined> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const profile = 1;

    const { status } = await fetch(
        `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (status === 200) return true;
};

export { setJoker, getJoker };
