import { Heading, TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import type { Week, Day } from '@api/workout';
import RepsInput from '@components/reps-input';
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

const Workout = ({ baseWeights, cycle, week, day }: Props) => {
    return (
        <>
            <Heading my="1rem" size="md">
                {exerciseToText(dayToExercise(day))}
            </Heading>
            <TableContainer>
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Sets/reps</Th>
                            <Th>Percentage</Th>
                            <Th isNumeric>Weight</Th>
                            <Th>Reps lifted</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {weekToPercentages(week).map((percentage, index) => {
                            const reps = weekToSetsReps(week)[index];

                            return (
                                <Tr key={`table-row-${index}`}>
                                    <Td>{`1x${reps}${index === 5 ? '+' : ''}`}</Td>
                                    <Td>{percentageToText(percentage)}</Td>
                                    <Td isNumeric>
                                        {2.5 * Math.ceil((baseWeights[dayToExercise(day)] * percentage) / 2.5)}
                                    </Td>
                                    <Td>{index === 5 ? <RepsInput cycle={cycle} week={week} day={day} /> : '-'}</Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Workout;
