'use client';

import { useEffect, useState, useId } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { type Week, type Day } from '@api/workout';
import JokerAPI from '@api/joker';
import { useProfile } from '@hooks/use-profile';
import Spinner from '@components/spinner';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
    num: number;
}

const JokerInput = ({ cycle, week, day, num }: Props) => {
    const [checked, setChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const id = useId();

    const { data: session } = useSession();

    const { profile } = useProfile();

    const handleChange = async () => {
        if (!session?.idToken) return;

        setLoading(true);
        setError(null);

        try {
            const result = await JokerAPI.putJoker({ idToken: session.idToken, profile, cycle, week, day, num });

            setLoading(false);

            if (result === null) {
                setError(`could not put joker ${num}`);
                return;
            }

            if (!result) {
                await signOut();
                return;
            }

            setChecked((prev) => !prev);
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
                const result = await JokerAPI.getJoker({ idToken: session.idToken, profile, cycle, week, day, num });

                setLoading(false);

                if (result === null) {
                    setError(`could not get joker ${num}`);
                    return;
                }

                if (result === 'reauth') {
                    await signOut();
                    return;
                }

                result === 'on' ? setChecked(true) : setChecked(false);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                setLoading(false);
                setError(JSON.stringify(error));
            }
        };
        void fetchWorkout();
    }, [cycle, week, day, num, setChecked, session?.idToken, profile]);

    return (
        <div className="grid grid-cols-2">
            <input type="checkbox" id={id} className="rounded w-4 h-4" checked={checked} onChange={handleChange} />
            <label hidden htmlFor={id}>
                Joker {num}
            </label>
            <div>
                {loading && <Spinner size="xs" />}
                {error && <p>🚨</p>}
            </div>
        </div>
    );
};

export default JokerInput;
