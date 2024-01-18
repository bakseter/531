import type { Metadata, ResolvingMetadata } from 'next';
import Workout from '@/components/server/workout';
import { days } from '@/utils/constants';
import { safeParseInt } from '@/utils/helpers';

interface Props {
    params: {
        cycle: string;
        week: string;
    };
}

const generateMetadata = ({ params: { week, cycle } }: Props, parent: ResolvingMetadata): Metadata => ({
    title: `Cycle ${cycle} | Week ${week}`,
    ...parent,
});

const WeekPage = ({ params }: Props) => {
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
