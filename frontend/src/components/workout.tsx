import {
    Spinner,
    Input,
    Box,
    Center,
    Text,
    Heading,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, parse } from 'date-fns';
import JokerInput from '@components/joker-input';
import RepsInputForm from '@components/reps-input-form';
import WorkoutAPI, { type Week, type Day } from '@api/workout';
import {
    weekToSetsReps,
    percentageToText,
    exerciseToText,
    type BaseWeights,
    weekToPercentages,
    dayToExercise,
} from '@utils/helpers';

interface Props {
    baseWeights: BaseWeights;
    cycle: number;
    week: Week;
    day: Day;
}

const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
};

interface FormValues {
    dateStr: string | null;
}

const Workout = ({ baseWeights, cycle, week, day }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, register, setValue } = useForm<FormValues>({ defaultValues: { dateStr: null } });

    const onSubmit = async ({ dateStr }: FormValues) => {
        if (dateStr === null) return;

        setLoading(true);
        setError(null);
        try {
            const date = parse(dateStr, 'yyyy-MM-dd', new Date());
            const result = await WorkoutAPI.putDate(cycle, week, day, date);

            setLoading(false);

            if (!result) {
                setError('could not put date');
                return;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setLoading(false);
            setError(JSON.stringify(error));
        }
    };

    useEffect(() => {
        const fetchDate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await WorkoutAPI.getDate(cycle, week, day);
                setLoading(false);

                if (response !== null) setValue('dateStr', format(response, 'yyyy-MM-dd'));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
            }
        };
        void fetchDate();
    }, [cycle, week, day, setValue]);

    return (
        <>
            <Heading my="1rem" size={['md', null, 'lg']}>
                {exerciseToText(dayToExercise(day))}
            </Heading>
            <form onChange={handleSubmit(onSubmit)} lang="no">
                {loading && <Spinner />}
                {error && <Text color="red">bruh</Text>}
                <Input type="date" {...register('dateStr')} />
            </form>
            <TableContainer pb="2rem">
                <Table variant="striped" size={['sm', null, 'md']}>
                    <Thead>
                        <Tr>
                            <Th>
                                <Text fontSize={['xx-small', 'small']}>Sets</Text>
                            </Th>
                            <Th>
                                <Text fontSize={['xx-small', 'small']}>Percent</Text>
                            </Th>
                            <Th isNumeric>
                                <Text fontSize={['xx-small', 'small']}>Weight</Text>
                            </Th>
                            <Th>
                                <Text fontSize={['xx-small', 'small']}>Actual</Text>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {weekToPercentages(week).map((percentage, index) => {
                            const reps = weekToSetsReps(week)[index];
                            const repsField = (index: number) => {
                                const jokerCutoff = 5;
                                if (index === jokerCutoff) {
                                    return <RepsInputForm cycle={cycle} week={week} day={day} />;
                                }

                                if (index > jokerCutoff) {
                                    return <JokerInput cycle={cycle} week={week} day={day} num={index - jokerCutoff} />;
                                }

                                return (
                                    <Center>
                                        <Text color="gray">–</Text>
                                    </Center>
                                );
                            };

                            return (
                                <>
                                    {index % 3 === 0 && (
                                        <Box key={`padding-box-${index}`} py="1rem">
                                            <Heading size={['xs', null, 'sm']}>{indexToHeading(index)}</Heading>
                                        </Box>
                                    )}
                                    <Tr key={`table-row-${index}`}>
                                        <Td>{`1x${reps}${index === 5 ? '+' : ''}`}</Td>
                                        <Td>{percentageToText(percentage)}</Td>
                                        <Td isNumeric>{`${
                                            2.5 * Math.ceil((baseWeights[dayToExercise(day)] * percentage) / 2.5)
                                        } kg`}</Td>
                                        <Td>{repsField(index)}</Td>
                                    </Tr>
                                </>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Workout;
