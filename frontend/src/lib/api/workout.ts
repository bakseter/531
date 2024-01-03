import { type decodeType, record, number } from 'typescript-json-decoder';
import { backendUrl } from '@utils/constants';

const intCoerciveDecoder = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number.parseInt(value, 10);
    throw new Error(`Expected number or string, got ${typeof value}`);
};

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
    reps: intCoerciveDecoder,
});
type Workout = decodeType<typeof workoutDecoder>;

const profileDecoder = (value: unknown) => {
    if (value === 1 || value === 2 || value === 3 || value === 4) return value;
    throw new TypeError('Invalid profile');
};
type Profile = decodeType<typeof profileDecoder>;

const WorkoutAPI = {
    getWorkoutCount: async ({
        idToken,
        profile,
    }: {
        idToken: string;
        profile: Profile;
    }): Promise<number | undefined> => {
        try {
            const response = await fetch(`${backendUrl}/workout/count?profile=${profile}`, {
                headers: { Authorization: `Bearer ${idToken}` },
            });

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

export default WorkoutAPI;
export { workoutDecoder, type Profile, type Week, type Day, type Workout };
