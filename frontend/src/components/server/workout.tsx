import { redirect } from 'next/navigation';
import { auth } from '@api/auth-config';
import { type Week, type Day } from '@api/workout';
import { exerciseToText, dayToExercise } from '@utils/helpers';
import BaseWeightsAPI from '@api/base-weights';
import JokerAPI from '@api/joker';
import WorkoutTable from '@components/client/workout-table';
import DateBoxForm from '@components/server/date-box-form';

interface Props {
    cycle: number;
    week: Week;
    day: Day;
}

const Workout = async ({ cycle, week, day }: Props) => {
    const session = await auth();
    if (!session?.idToken) redirect('/api/auth/signin');

    const baseWeights = await BaseWeightsAPI.getBaseWeights({ idToken: session.idToken, profile: 1 });
    const baseWeightsForCycle = await BaseWeightsAPI.getBaseWeightsForCycle({
        idToken: session.idToken,
        profile: 1,
        baseWeights,
        cycle,
    });

    const jokerAmount = await JokerAPI.getJokerAmount({ idToken: session.idToken, profile: 1, cycle, week, day });

    return (
        <>
            <div className="grid grid-flow-col items-center">
                <h3 className="font-bold my-2 inline">{exerciseToText(dayToExercise(day))}</h3>
                <div className="my-2">
                    <DateBoxForm cycle={cycle} week={week} day={day} />
                </div>
            </div>
            <div className="grid grid-cols-1 items-center">
                <WorkoutTable
                    cycle={cycle}
                    week={week}
                    day={day}
                    baseWeightsForCycle={baseWeightsForCycle}
                    initialJokerAmount={jokerAmount}
                />
            </div>
        </>
    );
};

export default Workout;
