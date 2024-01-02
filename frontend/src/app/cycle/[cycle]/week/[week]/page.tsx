import type { Metadata, ResolvingMetadata } from 'next';
import Workout from '@components/workout';
import { days } from '@utils/constants';
import { safeParseInt } from '@utils/helpers';

interface WeekPageProps {
    params: {
        week: string;
        cycle: string;
    };
}

const generateMetadata = ({ params }: WeekPageProps, parent: ResolvingMetadata): Metadata => ({
    title: `Cycle ${params.cycle} | Week ${params.week}`,
    ...parent,
});

const WeekPage = ({ params }: WeekPageProps) => {
    const cycle = safeParseInt(params.cycle);
    const week = safeParseInt(params.week);
    if ((week !== 1 && week !== 2 && week !== 3) || !cycle) throw new Error('breh');

    return days.map((day) => (
        <div className="mx-2" key={`workout-${day}-${week}-${cycle}`}>
            <Workout cycle={cycle} week={week} day={day} />
        </div>
    ));
};

export { generateMetadata };
export default WeekPage;
