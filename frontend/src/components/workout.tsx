import { Box, Center, Text, Heading, TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import JokerInput from '@components/joker-input';
import RepsInputForm from '@components/reps-input-form';
import { type Week, type Day } from '@api/workout';
import {
    weekToSetsReps,
    percentageToText,
    exerciseToText,
    type BaseWeights,
    weekToPercentages,
    dayToExercise,
} from '@utils/helpers';
import DateBoxForm from '@components/date-box-form';

const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
};

interface Props {
    cycleBaseWeights: BaseWeights;
    cycle: number;
    week: Week;
    day: Day;
}

const Workout = ({ cycleBaseWeights, cycle, week, day }: Props) => {
    return (
        <>
            <Heading my="1rem" size={['md', null, 'lg']}>
                {exerciseToText(dayToExercise(day))}
            </Heading>
            <DateBoxForm cycle={cycle} week={week} day={day} />
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
                                            2.5 * Math.ceil((cycleBaseWeights[dayToExercise(day)] * percentage) / 2.5)
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
