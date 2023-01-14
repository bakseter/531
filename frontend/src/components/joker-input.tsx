import { useEffect, useState } from 'react';
import { useBoolean, SimpleGrid, Spinner, GridItem, Checkbox } from '@chakra-ui/react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { signOut, useSession } from 'next-auth/react';
import { type Week, type Day } from '@api/workout';
import JokerAPI from '@api/joker';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
    num: number;
}

const JokerInput = ({ cycle, week, day, num }: Props) => {
    const [checked, setChecked] = useBoolean();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();

    const handleChange = async () => {
        if (!session?.idToken) return;
        setLoading(true);
        setError(null);

        try {
            const result = await JokerAPI.putJoker({ idToken: session.idToken, cycle, week, day, num });

            setLoading(false);

            if (result === null) {
                setError(`could not put joker ${num}`);
                return;
            }

            if (!result) {
                await signOut();
                return;
            }

            setChecked.toggle();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setLoading(false);
            setError(JSON.stringify(error));
        }
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!session?.idToken) return;
            setLoading(true);
            setError(null);

            try {
                const result = await JokerAPI.getJoker({ idToken: session.idToken, cycle, week, day, num });

                setLoading(false);

                if (result === null) {
                    setError(`could not get joker ${num}`);
                    return;
                }

                if (result === 'reauth') {
                    await signOut();
                    return;
                }

                result === 'on' ? setChecked.on() : setChecked.off();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setLoading(false);
                setError(JSON.stringify(error));
            }
        };
        void fetchWorkout();
    }, [cycle, week, day, num, setChecked, session?.idToken]);

    return (
        <SimpleGrid columns={2} justifyItems="center">
            <GridItem>
                <Checkbox isChecked={checked} size={['md', null, 'lg']} w="100%" onChange={handleChange} />
            </GridItem>
            <GridItem>
                {loading && <Spinner size={['sm', null, 'md']} />}
                {error && <AiFillExclamationCircle color="red" size="2rem" />}
            </GridItem>
        </SimpleGrid>
    );
};

export default JokerInput;
