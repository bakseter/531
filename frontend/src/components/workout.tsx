import {
    Button,
    Spinner,
    HStack,
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
import { useState } from 'react';
import JokerInput from '@components/joker-input';
import RepsInputForm from '@components/reps-input-form';
import { type Week, type Day } from '@api/workout';
import {
    weekToSetsReps,
    percentageToText,
    exerciseToText,
    weekToPercentages,
    dayToExercise,
    weekToDefiningRep,
} from '@utils/helpers';
import DateBoxForm from '@components/date-box-form';
import useBaseWeights from '@hooks/use-base-weights';

const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
};

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

const Workout = ({ cycle, week, day }: Props) => {
    const warmupCutoff = 2;
    const jokerCutoff = 5;
    const reps = (index: number): number | undefined => weekToSetsReps(week)[index];
    const roundToNearest = (index: number) => (index <= warmupCutoff ? 5 : 2.5);
    const [jokersWeightAdd, setJokersWeightAdd] = useState<number | undefined>();

    const { baseWeightsForCycle } = useBaseWeights();

    const handleClick = () => {
        setJokersWeightAdd((value) => (value === undefined ? 1 : value + 1));
    };

    const repsField = ({ index, percentage }: { index: number; percentage: number }) => {
        if (index === jokerCutoff) {
            return <RepsInputForm key={`reps-input-${cycle}-${week}-${day}`} cycle={cycle} week={week} day={day} />;
        }

        if (index > jokerCutoff) {
            return (
                <JokerInput
                    key={`joker-input-${cycle}-${week}-${day}-${index}-${percentage}`}
                    cycle={cycle}
                    week={week}
                    day={day}
                    num={index - jokerCutoff}
                />
            );
        }

        return (
            <Center key={`n/a-${percentage}-${index}`}>
                <Text color="gray">???</Text>
            </Center>
        );
    };

    const baseWeights = baseWeightsForCycle?.find((bw) => bw.cycle === cycle)?.baseWeights;

    if (!baseWeights) return <Spinner />;

    return (
        <>
            <HStack spacing={3}>
                <Heading my="1rem" size={['md', null, 'lg']}>
                    {exerciseToText(dayToExercise(day))}
                </Heading>
                <DateBoxForm cycle={cycle} week={week} day={day} />
            </HStack>
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
                        {weekToPercentages(week, jokersWeightAdd).map((percentage, index) => {
                            const headingText = indexToHeading(index);

                            return (
                                <>
                                    {index % 3 === 0 && index <= 6 && (
                                        <Box key={`padding-box-${index}`} py="1rem">
                                            {headingText && <Heading size={['xs', null, 'sm']}>{headingText}</Heading>}
                                        </Box>
                                    )}
                                    <Tr key={`table-row-${index}`}>
                                        <Td>{`1x${reps(index) ?? weekToDefiningRep(week)}${
                                            index === 5 ? '+' : ''
                                        }`}</Td>
                                        <Td>{percentageToText(percentage)}</Td>
                                        <Td isNumeric>{`${Math.max(
                                            20,
                                            roundToNearest(index) *
                                                Math.ceil(
                                                    (baseWeights[dayToExercise(day)] * percentage) /
                                                        roundToNearest(index),
                                                ),
                                        )} kg`}</Td>
                                        <Td>{repsField({ index, percentage })}</Td>
                                    </Tr>
                                </>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            <Button onClick={handleClick} mb="1rem">
                MORE!!!
            </Button>
        </>
    );
};

export default Workout;
