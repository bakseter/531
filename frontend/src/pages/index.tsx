import { useEffect } from 'react';
import { type GetServerSideProps } from 'next';
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
    useBreakpointValue,
} from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Workout from '@components/workout';
import { type Week, type Day } from '@api/workout';
import useBaseWeights from '@hooks/use-base-weights';
import BaseWeightsForm from '@components/base-weights-form';
import BaseWeightsModifierForm from '@components/base-weights-modifier-form';
import ProfileInputForm from '@components/profile-input-form';
import Title from '@components/title';
import { cycles, weeks, days } from '@utils/constants';

interface Props {
    weekTabIndex: number;
    cycleTabIndex: number;
}
const IndexPage = ({ weekTabIndex, cycleTabIndex }: Props) => {
    const { baseWeights } = useBaseWeights();
    const { data: session, status } = useSession();

    const cyclePrefix = useBreakpointValue({ lg: 'Cycle', base: '🔄' });
    const weekPrefix = useBreakpointValue({ lg: 'Week', base: '📆' });
    const profileHeader = useBreakpointValue({ lg: 'Profile', base: '👤' });
    const modifyCycleBaseWeightsHeader = useBreakpointValue({ lg: 'Modify cycle base weights', base: '📝' });

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
                        <Tabs isLazy defaultIndex={cycleTabIndex}>
                            <TabList>
                                {cycles.map((cycle) => (
                                    <Tab key={`tab-cycle-${cycle}`}>{`${cyclePrefix} ${cycle}`}</Tab>
                                ))}
                                <Tab>{profileHeader}</Tab>
                            </TabList>
                            <TabPanels>
                                {cycles.map((cycle) => (
                                    <TabPanel key={`tabpanel-cycle-${cycle}`} px="0rem">
                                        <Tabs isLazy defaultIndex={weekTabIndex}>
                                            <TabList>
                                                {weeks.map((week) => (
                                                    <Tab key={`tab-week-${week}`}>{`${weekPrefix} ${week}`}</Tab>
                                                ))}
                                                <Tab>{modifyCycleBaseWeightsHeader}</Tab>
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
                                                    <Heading size="sm">Profile</Heading>
                                                    <ProfileInputForm />
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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
    return { props: { weekTabIndex: 0, cycleTabIndex: 0 } };

    /*
     * TODO:
     * doesn't work with profile since server side, fix this

    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.idToken) {
    }

    const workoutCount = await WorkoutAPI.getWorkoutCount({ idToken: session.idToken });

    const cycleTabIndex = Math.floor((workoutCount ?? 0) / 12);
    const weekTabIndex = Math.floor(((workoutCount ?? 0) % 12) / 3);

    const props: Props = {
        weekTabIndex,
        cycleTabIndex,
    };

    return {
        props,
    };
    */
};

export default IndexPage;
