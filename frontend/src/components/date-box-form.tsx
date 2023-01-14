import { useForm } from 'react-hook-form';
import { HStack, Button, Text, Spinner, Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import WorkoutAPI, { type Week, type Day } from '@api/workout';

interface FormValues {
    dateStr: string | null;
}

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

const DateBoxForm = ({ cycle, week, day }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);

    const { handleSubmit, register } = useForm<FormValues>({ defaultValues: { dateStr: null } });

    const { data: session } = useSession();

    const onSubmit = async ({ dateStr }: FormValues) => {
        if (dateStr === null || !session?.idToken) return;

        setLoading(true);
        setError(null);
        setDate(null);
        try {
            const date = parse(dateStr, 'yyyy-MM-dd', new Date());
            const result = await WorkoutAPI.putDate({ idToken: session.idToken, cycle, week, day, date });

            setLoading(false);

            if (!result) {
                setError('could not put date');
                return;
            }

            setDate(date);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            setLoading(false);
            setError(JSON.stringify(error));
        }
    };

    useEffect(() => {
        const fetchDate = async () => {
            if (!session?.idToken) return;
            setLoading(true);
            setError(null);
            try {
                const response = await WorkoutAPI.getDate({ idToken: session.idToken, cycle, week, day });
                setLoading(false);

                if (response !== null) setDate(response);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
            }
        };
        void fetchDate();
    }, [cycle, week, day, session?.idToken]);

    return (
        <>
            {loading && <Spinner />}
            {error && <Text>date bruh moment: {JSON.stringify(error)}</Text>}
            <form onChange={handleSubmit(onSubmit)}>{!date && <Input type="date" {...register('dateStr')} />}</form>
            {date && (
                <HStack my="1rem">
                    <Text fontSize={['sm', null, 'md']} fontWeight="bold">
                        {format(date, 'EEEE dd. MMMM yyyy', { locale: nb })}
                    </Text>
                    <Button colorScheme="blue" size="xs" onClick={() => setDate(null)}>
                        Edit date
                    </Button>
                </HStack>
            )}
        </>
    );
};

export default DateBoxForm;
