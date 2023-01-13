import Head from 'next/head';
import { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanels, TabPanel, Divider, Heading, SimpleGrid, GridItem } from '@chakra-ui/react';
import { useSession, signIn } from 'next-auth/react';
import Workout from '@components/workout';
import { type BaseWeights } from '@api/base-weights';
import type { Week, Day } from '@api/workout';
import useBaseWeights from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';

const cycles: Array<number> = [1];
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
    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') void signIn();
    }, [status]);

    return (
        <>
            <Head>
                <title>5/3/1</title>
            </Head>
            <SimpleGrid columns={3}>
                <GridItem colSpan={[3, 3, 1]} colStart={[1, 1, 2]}>
                    {!baseWeights && <BaseWeightsForm />}
                    {baseWeights && (
                        <Tabs>
                            <TabList>
                                {cycles.map((cycle) => (
                                    <Tab key={`tab-cycle-${cycle}`}>{`Cycle ${cycle}`}</Tab>
                                ))}
                                <Tab>Base weights</Tab>
                            </TabList>
                            <TabPanels>
                                {cycles.map((cycle) => (
                                    <TabPanel key={`tabpanel-cycle-${cycle}`} px="0rem">
                                        <Tabs>
                                            <TabList>
                                                {weeks.map((week) => (
                                                    <Tab key={`tab-week-${week}`}>{`Week ${week}`}</Tab>
                                                ))}
                                            </TabList>
                                            <TabPanels>
                                                {weeks.map((week: Week) => (
                                                    <TabPanel m="1rem" key={`tabpanel-week-${week}`}>
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
                                    <Heading>Base weights</Heading>
                                    <BaseWeightsForm />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    )}
                </GridItem>
            </SimpleGrid>
        </>
    );
};

export default IndexPage;
