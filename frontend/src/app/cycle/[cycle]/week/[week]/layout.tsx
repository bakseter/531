'use client';

import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { weeks } from '@utils/constants';
import { safeParseInt } from '@utils/helpers';
import MenuLink from '@components/menu-link';

interface WeekLayoutProps {
    children: ReactNode;
}

const WeekLayout = ({ children }: WeekLayoutProps) => {
    const weekPrefix = '📆';

    const params = useParams();
    const currentCycle = params.cycle;
    const currentWeek = safeParseInt(params.week);

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
