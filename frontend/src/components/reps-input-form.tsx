import { useState, useEffect } from 'react';
import { SkeletonText, GridItem, Center, SimpleGrid, Select } from '@chakra-ui/react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { signOut, useSession } from 'next-auth/react';
import WorkoutAPI, { type Workout, type Week, type Day } from '@api/workout';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

interface FormValues {
    reps: number;
}

const RepsInputForm = ({ cycle, week, day }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, register, setValue } = useForm<FormValues>();

    const { data: session } = useSession();

    const onSubmit = async ({ reps }: FormValues) => {
        if (!session?.idToken) return;
        setLoading(true);
        setError(null);
        try {
            const workout: Workout = { cycle, week, day, reps };
            const result = await WorkoutAPI.putWorkout({ idToken: session.idToken, workout });

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
                const result = await WorkoutAPI.getWorkout({ idToken: session.idToken, cycle, week, day });

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
    }, [cycle, week, day, setValue, session?.idToken]);

    const maxReps = week === 1 ? 15 : week === 2 ? 10 : 5;

    return (
        <SimpleGrid columns={4}>
            <GridItem colSpan={3} justifySelf="center">
                <SkeletonText isLoaded={!loading} noOfLines={2}>
                    <form onChange={handleSubmit(onSubmit)}>
                        <Select size={['xs', null, 'md']} {...register('reps', { valueAsNumber: true })} w="100%">
                            <option value={0}></option>
                            {[...new Array(maxReps).keys()].map((_, index) => (
                                <option key={`select-option-${index}`} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </Select>
                    </form>
                </SkeletonText>
            </GridItem>
            {error && (
                <Center>
                    <AiFillExclamationCircle color="red" size="2rem" />
                </Center>
            )}
        </SimpleGrid>
    );
};

export default RepsInputForm;
