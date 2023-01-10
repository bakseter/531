import { useState, useEffect, useCallback } from 'react';
import { Center, Spinner, SimpleGrid, Select } from '@chakra-ui/react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import WorkoutAPI, { type Workout, type Week, type Day } from '@api/workout';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

interface FormValues {
    reps: number;
}

const RepsInput = ({ cycle, week, day }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, register, watch, setValue } = useForm<FormValues>();

    const onSubmit = useCallback(
        () =>
            async ({ reps }: FormValues) => {
                setLoading(true);
                try {
                    const workout: Workout = { cycle, week, day, reps };
                    const result = await WorkoutAPI.putWorkout(workout);

                    setLoading(false);

                    if (result === null) {
                        setError('could not put workout');
                        return;
                    }

                    setValue('reps', reps);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    setLoading(false);
                    setError(JSON.stringify(error));
                }
            },
        [cycle, week, day, setValue],
    );

    useEffect(() => {
        const fetchWorkout = async () => {
            setLoading(true);
            try {
                const result = await WorkoutAPI.getWorkout(cycle, week, day);

                setLoading(false);

                if (result === false) {
                    setError('could not get workout');
                    return;
                }

                if (result === true) {
                    setError(null);
                    return;
                }

                setValue('reps', result.reps);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setLoading(false);
                setError(JSON.stringify(error));
            }
        };
        void fetchWorkout();
    }, [cycle, week, day, setValue]);

    useEffect(() => {
        const subscription = watch(handleSubmit(onSubmit));
        return () => subscription.unsubscribe();
    }, [handleSubmit, watch, onSubmit]);

    return (
        <SimpleGrid columns={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Select {...register('reps')}>
                    <option value={0}></option>
                    {[...new Array(20).keys()].map((_, index) => (
                        <option key={`select-option-${index}`} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </Select>
            </form>
            <Center>
                {loading && <Spinner />}
                {error && <AiFillExclamationCircle color="red" size="2rem" />}
            </Center>
        </SimpleGrid>
    );
};

export default RepsInput;
