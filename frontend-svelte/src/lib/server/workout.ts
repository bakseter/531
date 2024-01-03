import { record, number, date } from 'typescript-json-decoder';
import { formatISO } from 'date-fns';
import { PUBLIC_BACKEND_API_VERSION, PUBLIC_BACKEND_URL } from '$env/static/public';
import { workoutDecoder, type Week, type Day, type Workout } from '$lib/types';

const BACKEND_URL = `${PUBLIC_BACKEND_URL}/${PUBLIC_BACKEND_API_VERSION}`;

const WorkoutAPI = {
  getWorkout: async ({
    idToken,
    profile,
    cycle,
    week,
    day
  }: {
    idToken: string;
    profile: number;
    cycle: number;
    week: Week;
    day: Day;
  }): Promise<Workout | undefined> => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/workout?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
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
    profile: number;
    workout: Workout;
  }): Promise<boolean> => {
    try {
      const { ok } = await fetch(`${BACKEND_URL}/workout?profile=${profile}`, {
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
    profile: number;
    cycle: number;
    week: Week;
    day: Day;
  }): Promise<Date | undefined> => {
    const response = await fetch(
      `${BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
      {
        headers: { Authorization: `Bearer ${idToken}` }
      }
    );

    if (response.status === 200) {
      const json = await response.json();
      return record({ date: date })(json).date;
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
    profile: number;
    cycle: number;
    week: Week;
    day: Day;
    date: Date;
  }): Promise<void> => {
    const { status } = await fetch(
      `${BACKEND_URL}/workout/date?profile=${profile}&cycle=${cycle}&week=${week}&day=${day}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ date: formatISO(date) })
      }
    );

    if (status !== 200) throw new Error('Failed to update date');
  },

  getWorkoutCount: async ({
    idToken,
    profile
  }: {
    idToken: string;
    profile: number;
  }): Promise<number | undefined> => {
    try {
      const response = await fetch(`${BACKEND_URL}/workout/count?profile=${profile}`, {
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
