import type { ReactNode } from 'react';
import MenuLink from '@/components/server/menu-link';
import { weeks } from '@/utils/constants';
import { safeParseInt } from '@/utils/helpers';

interface WeekLayoutProps {
    children: ReactNode;
    params: {
        cycle: string;
        week: string;
    };
}

const WeekLayout = ({ children, params: { cycle, week } }: WeekLayoutProps) => {
    const weekPrefix = String.fromCodePoint(0x1f4c5); // 📆

    const currentCycle = cycle;
    const currentWeek = safeParseInt(week);

    if (typeof currentCycle !== 'string') throw new Error('params.cycle is not a string');
    if (!currentWeek) throw new Error('params.week is not a number');

    return (
        <>
            <div className="grid grid-flow-col md:gap-1 lg:gap-2 xl:gap-4">
                {weeks.map((week) => (
                    <MenuLink
                        href={`/cycle/${currentCycle}/week/${week}`}
                        key={`link-week-${week}`}
                        className={`${currentWeek === week ? 'bg-sky-500' : ''}`}
                    >{`${weekPrefix} ${week}`}</MenuLink>
                ))}
                <MenuLink href={`/cycle/${currentCycle}/edit`}>📝</MenuLink>
            </div>
            {children}
        </>
    );
};

export default WeekLayout;
