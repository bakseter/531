'use server';

import { record, number } from 'typescript-json-decoder';
import { type Week, type Day } from '@/schema/workout';
import { auth } from '@/api/auth';
import { backendUrl } from '@/utils/constants';

const profile = 1;

const setJoker = async ({
    cycle,
    week,
    day,
    num,
}: {
    cycle: number;
    week: Week;
    day: Day;
    num: number;
}): Promise<void> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const { status } = await fetch(
        `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            method: 'PUT',
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (status !== 200 && status !== 202) throw new Error('Failed to update joker');
};

const getJoker = async ({
    cycle,
    week,
    day,
    num,
}: {
    cycle: number;
    week: Week;
    day: Day;
    num: number;
}): Promise<true | undefined> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const { status } = await fetch(
        `${backendUrl}/joker/${num}?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (status === 200) return true;
};

const getJokerAmount = async ({
    cycle,
    week,
    day,
}: {
    cycle: number;
    week: Week;
    day: Day;
}): Promise<number | undefined> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const response = await fetch(
        `${backendUrl}/joker/count?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (response.status === 200) {
        const json = await response.json();
        return record({ count: number })(json).count;
    }
};

export { setJoker, getJoker, getJokerAmount };
