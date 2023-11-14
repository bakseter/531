'use client';

import { useId, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signOut, useSession } from 'next-auth/react';
import WorkoutAPI, { type Workout, type Week, type Day } from '@api/workout';
import { useProfile } from '@hooks/use-profile';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

interface FormValues {
    reps: number;
}

const RepsInputForm = ({ cycle, week, day }: Props) => {
    const { profile } = useProfile();
    const [, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, register, setValue } = useForm<FormValues>();

    const { data: session } = useSession();

    const id = useId();

    const onSubmit = async ({ reps }: FormValues) => {
        if (!session?.idToken) return;

        setLoading(true);
        setError(null);

        try {
            const workout: Workout = { cycle, week, day, reps };
            const result = await WorkoutAPI.putWorkout({ idToken: session.idToken, profile, workout });

            setLoading(false);

            if (!result) {
                setError('could not put workout');
                return;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setError(JSON.stringify(error));
        }
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!session?.idToken) return;

            setLoading(true);
            setError(null);

            try {
                const result = await WorkoutAPI.getWorkout({ idToken: session.idToken, profile, cycle, week, day });

                setLoading(false);

                if (result === null) {
                    setError('could not get workout');
                    return;
                }

                if (result === true) {
                    setError(null);
                    return;
                }

                if (result === false) {
                    await signOut();
                    return;
                }

                setValue('reps', result.reps);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
            }
        };
        void fetchWorkout();
    }, [cycle, week, day, setValue, session?.idToken, profile]);

    const maxReps = 15;

    return (
        <>
            <form onChange={handleSubmit(onSubmit)}>
                <select id={id} {...register('reps', { valueAsNumber: true })}>
                    <option value={0}></option>
                    {[...new Array(maxReps).keys()].map((_, index) => (
                        <option key={`select-option-${index}`} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
                <label hidden htmlFor={id}>
                    Reps
                </label>
            </form>
            {error && <p>🚨</p>}
        </>
    );
};

export default RepsInputForm;
