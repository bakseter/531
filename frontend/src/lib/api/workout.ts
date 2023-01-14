import { type decodeType, record, number, date } from 'typescript-json-decoder';
import { formatISO } from 'date-fns';

const weekDecoder = (value: unknown) => {
    if (value === 1 || value === 2 || value === 3) return value;
    throw new TypeError('Invalid week');
};
type Week = decodeType<typeof weekDecoder>;

const dayDecoder = (value: unknown) => {
    if (value === 1 || value === 2 || value === 3 || value === 4) return value;
    throw new TypeError('Invalid day');
};
type Day = decodeType<typeof dayDecoder>;

const workoutDecoder = record({
    cycle: number,
    week: weekDecoder,
    day: dayDecoder,
    reps: number,
});
type Workout = decodeType<typeof workoutDecoder>;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

const WorkoutAPI = {
    getWorkout: async ({
        idToken,
        cycle,
        week,
        day,
    }: {
        idToken: string;
        cycle: number;
        week: Week;
        day: Day;
    }): Promise<Workout | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/workout?cycle=${cycle}&week=${week}&day=${day}`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (response.ok) {
                const workout = await response.json();
                return workoutDecoder(workout);
            }

            if (response.status === 404) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putWorkout: async ({ idToken, workout }: { idToken: string; workout: Workout }): Promise<boolean | null> => {
        try {
            const { ok, status } = await fetch(`${BACKEND_URL}/workout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(workout),
            });

            if (ok) return true;
            if (status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    getDate: async ({
        idToken,
        cycle,
        week,
        day,
    }: {
        idToken: string;
        cycle: number;
        week: Week;
        day: Day;
    }): Promise<Date | boolean | null> => {
        try {
            const response = await fetch(`${BACKEND_URL}/workout/date?cycle=${cycle}&week=${week}&day=${day}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

            if (response.ok) {
                const json = await response.json();
                return record({ date: date })(json).date;
            }

            if (response.status === 404) return true;
            if (response.status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putDate: async ({
        idToken,
        cycle,
        week,
        day,
        date,
    }: {
        idToken: string;
        cycle: number;
        week: Week;
        day: Day;
        date: Date;
    }): Promise<boolean | null> => {
        try {
            const { ok, status } = await fetch(`${BACKEND_URL}/workout/date?cycle=${cycle}&week=${week}&day=${day}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ date: formatISO(date) }),
            });

            if (ok) return true;
            if (status === 401) return false;

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },
};

export default WorkoutAPI;
export { workoutDecoder, type Week, type Day, type Workout };
