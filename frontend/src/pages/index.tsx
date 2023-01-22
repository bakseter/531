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
import type { Week, Day } from '@api/workout';
import useBaseWeights from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';
import BaseWeightsModifierForm from '@components/base-weights-modifier-form';
import Title from '@components/title';
import { cycles, weeks, days } from '@utils/constants';

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
                                                <Tab>Modify cycle base weights</Tab>
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
                                                                />
                                                                <Divider key={`divider-${week}-${day}`} />
                                                            </>
                                                        ))}
                                                    </TabPanel>
                                                ))}
                                                <TabPanel>
                                                    <BaseWeightsModifierForm cycle={cycle} />
                                                </TabPanel>
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
