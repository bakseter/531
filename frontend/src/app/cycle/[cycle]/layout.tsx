'use client';

import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { cycles } from '@utils/constants';
import { safeParseInt } from '@utils/helpers';
import MenuLink from '@components/menu-link';

interface CyclePageProps {
    children: ReactNode;
}

const CycleLayout = ({ children }: CyclePageProps) => {
    const cyclePrefix = '🔄';
    const profileHeader = '👤';

    const params = useParams();
    const currentCycle = safeParseInt(params.cycle);

    if (!currentCycle) throw new Error('params.cycle is not a number');

    return (
        <>
            <div className="grid grid-flow-col md:gap-1 lg:gap-2 xl:gap-4">
                {cycles.map((cycle) => (
                    <MenuLink
                        href={`/cycle/${cycle}/week/1`}
                        key={`link-cycle-${cycle}`}
                        className={`${currentCycle === cycle ? 'bg-sky-500' : ''}`}
                    >{`${cyclePrefix} ${cycle}`}</MenuLink>
                ))}
                <MenuLink href="/profile">{profileHeader}</MenuLink>
            </div>
            {children}
        </>
    );
};

export default CycleLayout;
