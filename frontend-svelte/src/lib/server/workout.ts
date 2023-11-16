import { record, number, date } from 'typescript-json-decoder';
import { formatISO } from 'date-fns';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { workoutDecoder, type Profile, type Week, type Day, type Workout } from '$lib/types';

const WorkoutAPI = {
	getWorkout: async ({
		idToken,
		profile,
		cycle,
		week,
		day
	}: {
		idToken: string;
		profile: Profile;
		cycle: number;
		week: Week;
		day: Day;
	}): Promise<Workout | undefined> => {
		try {
			const response = await fetch(
				`${PUBLIC_BACKEND_URL}/workout?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			);

			if (response.ok) {
				const workout = await response.json();
				return workoutDecoder(workout);
			}
		} catch (error) {
			console.error(error);
		}
	},

	putWorkout: async ({
		idToken,
		profile,
		workout
	}: {
		idToken: string;
		profile: Profile;
		workout: Workout;
	}): Promise<boolean> => {
		try {
			const { ok } = await fetch(`${PUBLIC_BACKEND_URL}/workout?profile=${profile}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`
				},
				body: JSON.stringify(workout)
			});

			return ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	getDate: async ({
		idToken,
		profile,
		cycle,
		week,
		day
	}: {
		idToken: string;
		profile: Profile;
		cycle: number;
		week: Week;
		day: Day;
	}): Promise<Date | undefined> => {
		try {
			const response = await fetch(
				`${PUBLIC_BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
				{
					headers: { Authorization: `Bearer ${idToken}` }
				}
			);

			if (response.ok) {
				const json = await response.json();
				return record({ date: date })(json).date;
			}
		} catch (error) {
			console.error(error);
		}
	},

	putDate: async ({
		idToken,
		profile,
		cycle,
		week,
		day,
		date
	}: {
		idToken: string;
		profile: Profile;
		cycle: number;
		week: Week;
		day: Day;
		date: Date;
	}): Promise<boolean> => {
		try {
			const { ok } = await fetch(
				`${PUBLIC_BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${idToken}`
					},
					body: JSON.stringify({ date: formatISO(date) })
				}
			);

			return ok;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	getWorkoutCount: async ({
		idToken,
		profile
	}: {
		idToken: string;
		profile: Profile;
	}): Promise<number | undefined> => {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/workout/count?profile=${profile}`, {
				headers: { Authorization: `Bearer ${idToken}` }
			});

			if (response.ok) {
				const json = await response.json();
				return record({ count: number })(json).count;
			}
		} catch (error) {
			console.error(error);
		}
	}
};

export default WorkoutAPI;
