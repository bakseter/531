'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { nb } from 'date-fns/locale';
import { signOut, useSession } from 'next-auth/react';
import WorkoutAPI, { type Week, type Day } from '@api/workout';
import { useProfile } from '@hooks/use-profile';
import Button from '@components/button';

interface FormValues {
    dateStr: string | null;
}

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

const DateBoxForm = ({ cycle, week, day }: Props) => {
    const { profile } = useProfile();
    const [, setLoading] = useState<boolean>(true);
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
            const result = await WorkoutAPI.putDate({ idToken: session.idToken, profile, cycle, week, day, date });

            setLoading(false);

            if (result === null) {
                setError('could not put date');
                return;
            }

            if (!result) {
                await signOut();
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
                const response = await WorkoutAPI.getDate({ idToken: session.idToken, profile, cycle, week, day });
                setLoading(false);

                if (response === null || response === true) return;
                if (response === false) {
                    await signOut();
                    return;
                }

                setDate(response);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setError(JSON.stringify(error));
            }
        };
        void fetchDate();
    }, [cycle, week, day, session?.idToken, profile]);

    return (
        <>
            {error && <p className="color-red">{error}</p>}
            <form onChange={handleSubmit(onSubmit)}>
                {!date && <input className="border-2 rounded-md border-sky-500" type="date" {...register('dateStr')} />}
            </form>
            {date && (
                <div className="grid grid-flow-col items-center text-start">
                    <p className="text-sm">{format(date, 'EEEE dd. MMMM yyyy', { locale: nb })}</p>
                    <Button className="m-4 p-1" onClick={() => setDate(null)}>
                        📝
                    </Button>
                </div>
            )}
        </>
    );
};

export default DateBoxForm;
