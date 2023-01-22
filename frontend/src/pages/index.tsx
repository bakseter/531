import { useEffect } from 'react';
import {
    Button,
    Tab,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Divider,
    Heading,
    SimpleGrid,
    GridItem,
    Stack,
    StackDivider,
    Text,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Workout from '@components/workout';
import { type BaseWeights } from '@api/base-weights';
import type { Week, Day } from '@api/workout';
import useBaseWeights from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';
import Title from '@components/title';

const cycles: Array<number> = [1, 2, 3];
const weeks: Array<Week> = [1, 2, 3];
const days: Array<Day> = [1, 2, 3, 4];

const addToBaseWeights = (baseWeights: BaseWeights, cycle: number) => {
    return {
        dl: baseWeights.dl + (cycle - 1) * 5,
        bp: baseWeights.bp + (cycle - 1) * 2.5,
        sq: baseWeights.sq + (cycle - 1) * 5,
        op: baseWeights.op + (cycle - 1) * 2.5,
    };
};

const IndexPage = () => {
    const { baseWeights } = useBaseWeights();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') void signIn();
    }, [status]);

    return (
        <>
            <Title />
            <SimpleGrid columns={5}>
                <GridItem colSpan={[5, null, null, 3]} colStart={[1, null, null, 2]}>
                    {!baseWeights && <BaseWeightsForm isFirstTime />}
                    {baseWeights && (
                        <Tabs isLazy>
                            <TabList>
                                {cycles.map((cycle) => (
                                    <Tab key={`tab-cycle-${cycle}`}>{`Cycle ${cycle}`}</Tab>
                                ))}
                                <Tab>Profile</Tab>
                            </TabList>
                            <TabPanels>
                                {cycles.map((cycle) => (
                                    <TabPanel key={`tabpanel-cycle-${cycle}`} px="0rem">
                                        <Tabs isLazy>
                                            <TabList>
                                                {weeks.map((week) => (
                                                    <Tab key={`tab-week-${week}`}>{`Week ${week}`}</Tab>
                                                ))}
                                            </TabList>
                                            <TabPanels>
                                                {weeks.map((week: Week) => (
                                                    <TabPanel key={`tabpanel-week-${week}`}>
                                                        {days.map((day: Day) => (
                                                            <>
                                                                <Workout
                                                                    key={`workout-${week}-${day}`}
                                                                    cycle={cycle}
                                                                    week={week}
                                                                    day={day}
                                                                    cycleBaseWeights={addToBaseWeights(
                                                                        baseWeights,
                                                                        cycle,
                                                                    )}
                                                                />
                                                                <Divider key={`divider-${week}-${day}`} />
                                                            </>
                                                        ))}
                                                    </TabPanel>
                                                ))}
                                            </TabPanels>
                                        </Tabs>
                                    </TabPanel>
                                ))}
                                <TabPanel>
                                    <SimpleGrid columns={5}>
                                        <GridItem colSpan={[5, null, null, 3]} colStart={[1, null, null, 2]}>
                                            <Stack
                                                direction={['column', null, null, 'row']}
                                                my="1rem"
                                                spacing={['1rem', null, '1rem', '3rem']}
                                                divider={<StackDivider />}
                                            >
                                                <BaseWeightsForm />
                                                <Stack direction="column" mx={['2rem', null, null, '0rem']}>
                                                    {session?.user && (
                                                        <>
                                                            <Heading size="sm">Name</Heading>
                                                            <Text>{session.user.name}</Text>
                                                            <Heading size="sm">Email</Heading>
                                                            <Text>{session.user.email}</Text>
                                                        </>
                                                    )}
                                                    <Button variant="outline" onClick={() => void signOut()}>
                                                        Sign out
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </GridItem>
                                    </SimpleGrid>
                                </TabPanel>
                                <TabPanel></TabPanel>
                            </TabPanels>
                        </Tabs>
                    )}
                </GridItem>
            </SimpleGrid>
        </>
    );
};

export default IndexPage;
