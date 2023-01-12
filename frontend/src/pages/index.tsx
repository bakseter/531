import Head from 'next/head';
import { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanels, TabPanel, Divider, Heading, Center } from '@chakra-ui/react';
import { useSession, signIn } from 'next-auth/react';
import Workout from '@components/workout';
import type { Week, Day } from '@api/workout';
import useBaseWeights from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';

const weeks: Array<Week> = [1, 2, 3];

const days: Array<Day> = [1, 2, 3, 4];

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
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Center>
                {!baseWeights && <BaseWeightsForm />}
                {baseWeights && (
                    <Tabs>
                        <TabList>
                            {weeks.map((week) => (
                                <Tab key={`tab-${week}`}>{`Week ${week}`}</Tab>
                            ))}
                            <Tab>Base weights</Tab>
                        </TabList>
                        <TabPanels>
                            {weeks.map((week: Week, index) => (
                                <TabPanel m="1rem" key={`tabpanel-${week}`}>
                                    <Heading my="1rem">{`Week ${index + 1}`}</Heading>
                                    {days.map((day: Day) => (
                                        <>
                                            <Workout
                                                key={`workout-${week}-${day}`}
                                                cycle={1}
                                                week={week}
                                                day={day}
                                                baseWeights={baseWeights}
                                            />
                                            <Divider key={`divider-${week}-${day}`} />
                                        </>
                                    ))}
                                </TabPanel>
                            ))}
                            <TabPanel>
                                <Heading>Base weights</Heading>
                                <BaseWeightsForm />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}
            </Center>
        </>
    );
};

export default IndexPage;
