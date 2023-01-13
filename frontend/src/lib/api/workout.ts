import type { decodeType } from 'typescript-json-decoder';
import { record, number } from 'typescript-json-decoder';
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

const WorkoutAPI = {
    getWorkout: async (cycle: number, week: Week, day: Day): Promise<Workout | boolean> => {
        try {
            const response = await fetch(`/api/workout?cycle=${cycle}&week=${week}&day=${day}`);

            if (response.ok) {
                const workout = await response.json();
                return workoutDecoder(workout);
            }

            if (response.status === 404) return true;

            return false;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return false;
        }
    },

    putWorkout: async (workout: Workout): Promise<boolean> => {
        try {
            const { ok } = await fetch('/api/workout', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workout),
            });

            return ok;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return false;
        }
    },

    getDate: async (cycle: number, week: Week, day: Day): Promise<Date | null> => {
        try {
            const response = await fetch(`/api/workout/date?cycle=${cycle}&week=${week}&day=${day}`);

            if (response.ok) {
                const date = await response.json();
                return new Date(date);
            }

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return null;
        }
    },

    putDate: async (cycle: number, week: Week, day: Day, date: Date): Promise<boolean> => {
        try {
            const { ok } = await fetch(`/api/workout/date?cycle=${cycle}&week=${week}&day=${day}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: formatISO(date) }),
            });

            return ok;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            return false;
        }
    },
};

export default WorkoutAPI;
export { workoutDecoder, type Week, type Day, type Workout };
