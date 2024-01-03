'use server';

import { formatISO } from 'date-fns';
import { record, date as dateDecoder } from 'typescript-json-decoder';
import { auth } from '@api/auth-config';
import type { Week, Day } from '@api/workout';
import { backendUrl } from '@utils/constants';

const profile = 1;

const setDate = async ({
    cycle,
    week,
    day,
    date,
}: {
    cycle: number;
    week: Week;
    day: Day;
    date: Date;
}): Promise<void> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const { status } = await fetch(
        `${backendUrl}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.idToken}`,
            },
            body: JSON.stringify({ date: formatISO(date) }),
        },
    );

    if (status !== 200 && status !== 202) throw new Error(`something went wrong: ${status}`);
};

const getDate = async ({ cycle, week, day }: { cycle: number; week: Week; day: Day }): Promise<Date | undefined> => {
    const session = await auth();
    if (!session?.idToken) throw new Error('no session');

    const response = await fetch(
        `${backendUrl}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
        {
            headers: { Authorization: `Bearer ${session.idToken}` },
        },
    );

    if (response.status === 200) {
        const json = await response.json();
        return record({ date: dateDecoder })(json).date;
    }
};

export { setDate, getDate };
